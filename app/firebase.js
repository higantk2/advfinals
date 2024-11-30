// Import the functions needed from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0ElC5EbMa8feYGA99gKSodtlCMvxQrHY",
  authDomain: "adv-tama-kana.firebaseapp.com",
  projectId: "adv-tama-kana",
  storageBucket: "adv-tama-kana.firebasestorage.app",
  messagingSenderId: "357619757909",
  appId: "1:357619757909:web:c7f0d110a9662a467bf5dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication

export { auth };
