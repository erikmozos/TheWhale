// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore ,doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4c4JNdlYUxpklB9HrxvlGPPS4REiMhvc",
  authDomain: "whale-mozos-id.firebaseapp.com",
  projectId: "whale-mozos-id",
  storageBucket: "whale-mozos-id.firebasestorage.app",
  messagingSenderId: "822807519565",
  appId: "1:822807519565:web:e15f38d2bd7cac5dd4d704",
  measurementId: "G-PBL42TCX6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();


export const createUser = async (collectionName, userData) => {
  try {
    const counterRef = doc(db, "counters", "usersCounter");

    const counterSnap = await getDoc(counterRef);
    let newId = 1; 

    if (counterSnap.exists()) {
      newId = counterSnap.data().lastId + 1;
    }

    await setDoc(counterRef, { lastId: newId }, { merge: true });

    await setDoc(doc(db, collectionName, newId.toString()), {
      id: newId,
      ...JSON.parse(userData),
    });

    console.log("Usuario creado con ID:", newId);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
  }
};

  
  export const getUsers = async () => {
    console.log("Recogiendo Datos");
    
    try {
      const querySnapshot = await getDocs(collection(db, 'users')); 
      console.log("Datos cogidos:", querySnapshot);
      return querySnapshot; 
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return []; 
    }
  };


export const hasUsers = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  
  return !usersSnapshot.empty;  
};



export const userLogIn = async (email, password) => {
  try {
    const usersRef = collection(db, "users");

    const emailQuery = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      console.log("Correo o contraseña incorrectos."); // Generic message to avoid leaking info
      return null;
    }

    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = { id: doc.id, ...doc.data() };
    });

    // Step 2: Hash the input password using the retrieved salt
    const hashedPassword = CryptoJS.SHA256(password + userData.salt).toString();

    // Step 3: Compare the stored hashed password with the computed hash
    if (hashedPassword === userData.password_hash) {
      console.log("Usuario autenticado:", userData.id, userData);
      return userData;
    } else {
      console.log("Correo o contraseña incorrectos.");
      return null;
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return null;
  }
};
