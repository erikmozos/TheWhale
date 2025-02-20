// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4c4JNdlYUxpklB9HrxvlGPPS4REiMhvc",
  authDomain: "whale-mozos-id.firebaseapp.com",
  projectId: "whale-mozos-id",
  storageBucket: "whale-mozos-id.firebasestorage.app",
  messagingSenderId: "822807519565",
  appId: "1:822807519565:web:e15f38d2bd7cac5dd4d704",
  measurementId: "G-PBL42TCX6H"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore after app initialization
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signOut, onAuthStateChanged, doc, updateDoc, updatePassword };

// Crear usuari per defecte
export async function createDefaultUser() {
  try {
    const email = "desenvolupador@iesjoanramis.org";
    const password = "Ramis.20";

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: "admin",
      email,
      role: "admin",
      edit_users: true,
      edit_news: true,
      edit_bone_files: true,
      active: true,
      is_first_login: true,
    });

    console.log("Usuario por defecto creado:", user.uid);
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
  }
}

// Iniciar sesión con Firebase Auth
export const userLogIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos adicionales desde Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const userData = { id: user.uid, ...userDoc.data() };
      localStorage.setItem("user", JSON.stringify(userData)); 
      console.log("Usuario autenticado:", userData);

      console.log(userDoc.data().is_first_login);

      if(userDoc.data().is_first_login){
          window.location.href = "../pages/logIn-changePassword.html"
      }
      return userData;
    } else {
      console.log("Usuario autenticado, pero sin datos en Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error en login:", error.message);
    return null;
  }
}

export const hasUsers = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  
  return !usersSnapshot.empty;  
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


export const changeUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser; // Obtener usuario autenticado
    if (!user) throw new Error("No hay usuario autenticado");

    // Actualizar contraseña en Firebase Authentication
    await updatePassword(user, newPassword);

    // Actualizar Firestore para marcar que ya no es el primer inicio de sesión
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      is_first_login: false
    });

    console.log("Contraseña actualizada correctamente.");
    alert("Tu contraseña ha sido actualizada con éxito.");
    window.location.href = "../index.html"; // Redirigir al usuario tras el cambio
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error.message);
    alert("Error al cambiar la contraseña: " + error.message);
  }
};

