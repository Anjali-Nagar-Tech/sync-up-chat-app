# SyncUp — Real-Time Chat App

React Native (Expo) + Node.js + MongoDB Atlas + Socket.io

---

## Project Structure

```
Chat App/
├── backend/       Node.js + Express + Socket.io
└── frontend/      React Native + Expo Router
```

---

## Local Development

### 1. Backend

```bash
cd backend
# Fill in your values:
cp .env.example .env

npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend (Android Emulator)

```bash
cd frontend
npm install

# Run ADB reverse so emulator can reach localhost
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5000 tcp:5000

npx expo start --android --clear
```

---

## Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (default 7d) |
| `CLIENT_URL` | Allowed CORS origins, comma-separated, or `*` |
| `PROTECTED_USERS` | Comma-separated usernames never deleted on startup |
| `DEMO_CUTOFF` | Users created before this ISO date are removed on startup |

---

## Deploy to Railway

1. Push `backend/` to a GitHub repository
2. Create a new Railway project → Deploy from GitHub
3. Set environment variables in Railway dashboard (copy from `.env.example`)
4. Railway auto-detects Node.js and runs `npm run build && node dist/server.js`

After deploy, update `frontend/src/constants/api.ts`:
```ts
const BASE_HOST = "https://your-app.railway.app";
```

---

## Build APK (EAS Build)

```bash
cd frontend
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Download the `.apk` from the EAS dashboard and install on your device.

---

## Features

- Username + Password authentication (JWT)
- AsyncStorage token persistence — auto-login on restart
- One-to-one private messaging
- Socket.io real-time delivery
- MongoDB message persistence
- Chat history loads on every screen open
- User search by username
- Last message preview on home screen
- Keyboard-safe input bar on Android

---

## Test Flow

1. Register **User A**
2. Register **User B** (different device/emulator)
3. User A opens User B from the list → sends a message
4. User B receives it in real time
5. User B replies → User A receives it
6. Sign out User B → sign in again → messages still visible
7. Restart app → messages still visible
