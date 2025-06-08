import { auth } from './firebase';  // Add this import
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'posts'), {
      title,
      content,
      createdAt: new Date().toISOString(),
      author: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Anonymous'
    });
    setTitle('');
    setContent('');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Post
          </Button>
        </form>
      </Paper>

      <List>
        {posts.map(post => (
          <Paper key={post.id} sx={{ mb: 2, p: 2 }}>
            <ListItem>
              <ListItemText
                primary={post.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      By {post.authorName}
                    </Typography>
                    {` — ${new Date(post.createdAt).toLocaleString()}`}
                    <br />
                    {post.content}
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default Home;