# SyncUp Chat App

A real-time chat application featuring a decoupled frontend and backend architecture.
Direct download link - https://expo.dev/accounts/anjali_nagar/projects/syncup/builds/a0666310-2959-4107-b8ac-a2fe42b865cc

---

## 🚀 How to Run the App Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your local machine.


### 1. Clone the Repository
```bash
git clone https://github.com/Anjali-Nagar-Tech/sync-up-chat-app.git
cd SyncUp-Chat-App

2. Set Up the Backend
Navigate into the backend folder:

Bash
cd backend
Install the required dependencies:

Bash
npm install
Create a .env file in the root of the backend folder and add your environment variables (e.g., PORT, DATABASE_URL, JWT_SECRET).

Start the backend development server:

Bash
npm run dev
3. Set Up the Frontend (React Native + Expo)
Open a new terminal window or tab and navigate to the frontend folder:

Bash
cd frontend
Install the required mobile dependencies:

Bash
npm install
Start the Expo development server:

Bash
npx expo start
To run the app:

On a physical device: Install the Expo Go app from the App Store (iOS) or Play Store (Android). Scan the QR code displayed in your terminal with your device's camera or the Expo Go app.

On an emulator/simulator: Press a in your terminal to open the Android Emulator, or i to open the iOS Simulator (Mac required).🌐 Live Backend URL
The backend API is deployed and accessible live at: 

🔗 https://authentic-kindness-production-95b1.up.railway.app 

🔑 Test Credentials
Use these pre-configured accounts to test the real-time chat functionality across multiple browser sessions:

Account 1
Username: Vivek Shukla

Password: Yes@2525

Account 2
Username: Abhinav Desai

Password: No@2525

Account 3
Username : John Vran

Password: Yes@2525



💬 Chat History Approach
This project implements Option B (Server-Side Storage / Database Persistence) for handling chat logs.

Database Engine: MongoDB Atlas (Cloud Hosted Cluster)

How it works: When a message is sent via WebSockets/HTTP, it is parsed by the backend and saved directly to a cloud database cluster in MongoDB Atlas before or upon delivery.
This structure guarantees high availability, secure data layer abstraction, and allows users to seamlessly retrieve their complete historical chat log whenever they sign back into the application from any device.

