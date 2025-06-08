const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// ✅ Allow frontend from multiple origins
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://simple-forum-khaki.vercel.app',
    'https://simple-forum.onrender.com'
  ],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Firebase Admin Init
const serviceAccount = require('/etc/secrets/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ✅ Middleware: Auth Check
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!token) return res.status(401).send('Unauthorized: No token');

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).send('Unauthorized: Invalid token');
  }
};

// ✅ Middleware: Admin Role Check
const isAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const firestoreRole = userDoc.exists ? userDoc.data().role : null;
    const tokenRole = req.user.role || req.user.claims?.role;

    if (firestoreRole === 'admin' || tokenRole === 'admin') {
      return next();
    } else {
      return res.status(403).send('Forbidden: Admins only');
    }
  } catch (err) {
    console.error('isAdmin error:', err);
    return res.status(500).send('Server error');
  }
};

// ✅ POST /api/assign-role
app.post('/api/assign-role', authenticate, isAdmin, async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) return res.status(400).send('Missing email or role');

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    // Set role on custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Save in Firestore
    await db.collection('users').doc(userRecord.uid).set(
      {
        role,
        email: userRecord.email,
      },
      { merge: true }
    );

    res.send(`Role '${role}' assigned to user '${email}'`);
  } catch (err) {
    console.error('Assign role error:', err);
    res.status(500).send('Failed to assign role');
  }
});

// ✅ Example Routes for posts
app.get('/api/posts', authenticate, async (req, res) => {
  try {
    const postsSnap = await db.collection('posts').orderBy('createdAt', 'desc').get();
    const posts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).send('Error fetching posts');
  }
});

app.post('/api/posts', authenticate, async (req, res) => {
  const { title, content } = req.body;
  const post = {
    title,
    content,
    author: req.user.uid,
    authorName: req.user.name || 'Anonymous',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await db.collection('posts').add(post);
    res.json({ id: docRef.id, ...post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).send('Error creating post');
  }
});

app.delete('/api/posts/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await db.collection('posts').doc(req.params.id).delete();
    res.send('Post deleted');
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).send('Error deleting post');
  }
});

// ✅ Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));