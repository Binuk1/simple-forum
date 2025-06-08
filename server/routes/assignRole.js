import { auth } from './firebase';

export const assignRole = async (email, role) => {
  try {
    // Get the current user's token (must be an admin!)
    const token = await auth.currentUser.getIdToken();

    const response = await fetch('http://localhost:5000/api/assign-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token for verification
      },
      body: JSON.stringify({ email, role }),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || 'Failed to assign role');
    }

    alert(`✅ Success: ${text}`);
  } catch (err) {
    console.error(err);
    alert(`❌ Error: ${err.message}`);
  }
};
