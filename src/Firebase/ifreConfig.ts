// src/firebase/config.ts

// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-f3kgjpBUGUAircTU9xIvlbWQfb14uOw",
  authDomain: "gaitanalyzer-c23c7.firebaseapp.com",
  projectId: "gaitanalyzer-c23c7",
  storageBucket: "gaitanalyzer-c23c7.firebasestorage.app",
  messagingSenderId: "801709333995",
  appId: "1:801709333995:web:1ea959ce4be50956cf4dae",
   databaseURL: "https://gaitanalyzer-c23c7-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database: Database = getDatabase(app);

export { database };