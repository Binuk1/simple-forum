import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Home from './Home';
import Login from './Login';
import AdminPanel from './AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);

        // Fetch user's role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setIsAdmin(data.role === 'admin');
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Failed to fetch user role:', err);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <BrowserRouter>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Simple Forum
            </Typography>
            {user ? (
              <>
                {isAdmin && (
                  <Button color="inherit" component={RouterLink} to="/admin">
                    Admin
                  </Button>
                )}
                <Button color="inherit" onClick={() => auth.signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/admin" element={user && isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
