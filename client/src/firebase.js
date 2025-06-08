import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZBDscawrUp_xKxyNjjOsc3WCcYb7Zxk4",
  authDomain: "simple-forum-de14a.firebaseapp.com",
  projectId: "simple-forum-de14a",
  storageBucket: "simple-forum-de14a.firebasestorage.app",
  messagingSenderId: "1040136176032",
  appId: "1:1040136176032:web:3431c9f24fe24194c664c5",
  measurementId: "G-87ZXS2H9N8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Updated register function to add user doc to Firestore
export const register = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create Firestore document for this user with default role 'user'
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: 'user',
    createdAt: new Date()
  });

  return user;
};

export const logout = () => {
  return signOut(auth);
};
