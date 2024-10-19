// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAode4iIJ096VRDf7o9WtRgYX5ceGkZd0c",
    authDomain: "hcratch-wiki-project-0001.firebaseapp.com",
    projectId: "hcratch-wiki-project-0001",
    storageBucket: "hcratch-wiki-project-0001.appspot.com",
    messagingSenderId: "985459224012",
    appId: "1:985459224012:web:85fa47083aa716e8a50169",
    measurementId: "G-CTB0XLE55W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };