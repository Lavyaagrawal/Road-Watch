import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";



import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDDEdiZlyI5zd7nKRv8-iJJ40Lp66Ya4Xs",
    authDomain: "roadwatch-8d83a.firebaseapp.com",
    projectId: "roadwatch-8d83a",
    storageBucket: "roadwatch-8d83a.appspot.com",
    messagingSenderId: "972980795500",
    appId: "1:972980795500:web:88614e9b15c56af1794049",
    measurementId: "G-S2PCMRJSRL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export const ADMIN_EMAIL =
    "lavyaagrawal123@gmail.com";