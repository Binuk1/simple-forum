import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUserRole(userDoc.data().role);
        } else {
          setCurrentUserRole(null);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      } finally {
        setLoadingRole(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) fetchRole(user);
      else {
        setCurrentUserRole(null);
        setLoadingRole(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserRole !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [currentUserRole]);

  const assignAdminRole = async () => {
    if (!auth.currentUser) return alert('❌ You must be signed in');

    try {
      const token = await auth.currentUser.getIdToken();
      console.log('📨 Sending token:', token);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/assign-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role: 'admin' })
      });

      const text = await response.text();
      if (!response.ok) throw new Error(text);

      alert(`✅ ${text}`);
      setEmail('');

      // Refresh user list
      const updatedUsers = await getDocs(collection(db, 'users'));
      setUsers(updatedUsers.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Assign admin role failed:', error);
      alert(`❌ ${error.message}`);
    }
  };

  if (loadingRole) return <Typography>Loading...</Typography>;
  if (currentUserRole !== 'admin') return <Typography>❌ You do not have admin access.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Assign Admin Role</Typography>
        <TextField
          label="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={assignAdminRole}>Make Admin</Button>
      </Box>

      <Typography variant="h6" gutterBottom>Users</Typography>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            <ListItemText
              primary={user.email}
              secondary={user.role === 'admin' ? 'Admin' : 'User'}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminPanel;
