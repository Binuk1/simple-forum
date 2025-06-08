// server/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('/etc/secrets/serviceAccountKey.json'); // replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
