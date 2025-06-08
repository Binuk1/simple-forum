# Simple Forum App

A minimal but functional full-stack forum app built with **React.js**, **Node.js (Express)**, and **Firebase** for authentication and database. Includes admin panel features such as role assignment and post management.

---

## 🌐 Live Demo

> Coming soon — will be deployed via Firebase or Vercel

---

## 🔧 Tech Stack

### Frontend:

* React.js (Vite or CRA)
* Firebase Authentication
* Material UI (MUI) for styling

### Backend:

* Node.js + Express
* Firebase Admin SDK (Firestore for DB)

### Hosting/Deploy:

* Firebase Hosting (or Vercel for frontend)

---

## 📁 Folder Structure

```
project-root/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── AdminPanel.js
│       └── firebase.js
│
├── server/                # Express backend
│   ├── app.js
│   └── serviceAccountKey.json (gitignored)
│
├── .gitignore
├── README.md
└── CHANGELOG.md
```

---

## 🔐 Features

### ✅ Authentication

* Firebase Email/Password Sign-in
* Secure token validation via Firebase Admin SDK

### 🛡️ Admin Panel

* View all users
* Assign `admin` role by email
* Protected admin-only routes

### 🗨️ Posts API

* Create / Read / Delete posts
* Post ownership and metadata saved to Firestore

---

## 🧪 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/simple-forum.git
cd simple-forum
```

### 2. Install dependencies

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Add Firebase credentials

In `server/`, add your `serviceAccountKey.json` downloaded from Firebase Console.

### 4. Start backend and frontend

```bash
# In one terminal
cd server
node app.js

# In another terminal
cd client
npm start
```

> Frontend: [http://localhost:3000](http://localhost:3000)
> Backend: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Deployment

### Option 1: Firebase Hosting

* Deploy frontend to Firebase Hosting
* Use Cloud Functions or separate backend hosting (e.g., Render)

### Option 2: Vercel + Firebase

* Deploy React frontend to Vercel
* Keep Firebase backend via Firebase Admin SDK

Let us know if you want automated CI/CD or GitHub Actions setup.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

MIT License
