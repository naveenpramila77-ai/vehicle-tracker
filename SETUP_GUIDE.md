# 🛰️ TrackFlow — Real-Time Vehicle Tracking System
### Complete Setup Guide

---

## 📁 Project Structure

```
vehicle-tracking/
├── frontend/
│   └── index.html        ← User login + GPS tracking page
├── admin/
│   └── index.html        ← Admin dashboard (see all users live)
├── backend/
│   ├── server.js         ← Express server (serves both pages)
│   └── package.json
├── firestore.rules       ← Firebase security rules
└── SETUP_GUIDE.md        ← You are here
```

---

## 🔥 STEP 1 — Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → give it a name (e.g. `trackflow`)
3. Click Continue (disable Analytics if you want) → **Create project**

---

## 🔐 STEP 2 — Enable Firebase Authentication

1. In your Firebase console, click **Authentication** (left sidebar)
2. Click **"Get started"**
3. Under **Sign-in method**, enable **Email/Password**
4. Click **Save**

---

## 🗄️ STEP 3 — Create Firestore Database

1. Click **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Pick a region close to you (e.g. `asia-south1` for India) → **Enable**
5. Go to **Rules** tab and paste the contents of `firestore.rules`:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /locations/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
6. Click **Publish**

---

## 🔑 STEP 4 — Get Your Firebase Config

1. Go to **Project Settings** (gear icon, top left)
2. Scroll down to **"Your apps"** section
3. Click **"</>" (Web)** icon to add a web app
4. Give it a nickname → click **Register app**
5. Copy the `firebaseConfig` object — it looks like:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "yourproject.firebaseapp.com",
     projectId: "yourproject",
     storageBucket: "yourproject.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

---

## 🗺️ STEP 5 — Get Google Maps API Key

1. Go to https://console.cloud.google.com
2. Select (or create) a project — use the SAME project as Firebase if possible
3. Search **"Maps JavaScript API"** → Enable it
4. Go to **APIs & Services → Credentials**
5. Click **"Create Credentials" → API Key**
6. Copy the API key
7. (Optional but recommended) Restrict key to your domain under "Application restrictions"

---

## ✏️ STEP 6 — Insert Your Credentials

Open **BOTH** files and replace placeholders:

### In `frontend/index.html` (lines ~175-182 and ~215):

```js
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};
```

And replace the Maps script tag:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=PASTE_YOUR_MAPS_KEY" async defer></script>
```

### In `admin/index.html` — SAME replacements (both Firebase config + Maps key)

---

## 🚀 STEP 7 — Create Admin Account

1. Register a user through the frontend (frontend/index.html)
2. Note down that email — this is your admin account
3. That same email/password logs into the admin panel

> **Or**: In Firebase Console → Authentication → Add user manually

---

## 💻 STEP 8 — Run the Server

```bash
# Open terminal in the project folder
cd vehicle-tracking/backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

Then open in your browser:
- 👤 **User App**: http://localhost:3000/
- 🔐 **Admin Panel**: http://localhost:3000/admin

---

## 🌐 STEP 9 — Deploy to the Real World (Optional)

### Option A — Railway (Free, easiest)
1. Go to https://railway.app → Sign up with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Upload/push your project to GitHub first
4. Railway auto-detects Node.js and runs `npm start`
5. You get a live URL like `https://trackflow-xyz.railway.app`

### Option B — Render (Free)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Build: `cd backend && npm install`
4. Start: `cd backend && node server.js`

### Option C — VPS (Full control)
```bash
# On your server (Ubuntu)
git clone your-repo
cd vehicle-tracking/backend
npm install
# Use PM2 to keep it running
npm install -g pm2
pm2 start server.js --name trackflow
pm2 save
```

---

## 📱 How It Works in Real World

1. **User opens the app URL** → sees the beautiful login page
2. **User registers/logs in** → Google Maps opens automatically
3. **Browser asks for location permission** → user clicks Allow
4. **GPS coordinates are sent to Firestore every ~5 seconds** (live)
5. **Admin opens /admin** → logs in → sees ALL users on the map in real-time
6. **Admin clicks any user** → map focuses on their location instantly

---

## 🛡️ Security Notes

- Each user can ONLY write their OWN location (Firestore rules enforce this)
- Admin must be authenticated to read ANY location data
- All data is transmitted over HTTPS (Firebase handles this)
- Restrict your Google Maps API key to your domain in production

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Map not loading | Check Maps API key; ensure Maps JavaScript API is enabled |
| Firebase error | Double-check config values; ensure Auth & Firestore are enabled |
| Location not updating | Allow location permission in browser; try HTTPS (required on mobile) |
| Admin can't see users | Make sure Firestore rules are published |
| CORS errors | Make sure you're running through the backend server, not opening HTML directly |

