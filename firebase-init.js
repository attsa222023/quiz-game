// Firebase SDK init, loaded as a CDN-hosted ES module (no bundler/build step,
// consistent with the rest of this project). Only used by online.js.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Not secret - Firebase's security model relies on Firestore rules, not on
// hiding this config. Safe to keep in a public repo.
const firebaseConfig = {
  apiKey: "AIzaSyCVRmVn_sKsKsY4U-m6FiDi6c4WoQfOj1I",
  authDomain: "name-them-all.firebaseapp.com",
  projectId: "name-them-all",
  storageBucket: "name-them-all.firebasestorage.app",
  messagingSenderId: "306377888032",
  appId: "1:306377888032:web:720a4c49a19df2f0078745",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let resolveAuthReady;
// Resolves with the anonymous uid once sign-in completes; online.js awaits
// this before any write that needs auth.currentUser.
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

onAuthStateChanged(auth, (user) => {
  if (user) resolveAuthReady(user.uid);
});

signInAnonymously(auth).catch((err) => {
  console.error("Firebase anonymous sign-in failed:", err);
});

window.Firebase = { app, db, auth, authReady };
