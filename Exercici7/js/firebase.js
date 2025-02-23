// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';
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
      }else{
        window.location.href = "../index.html"
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

// ...existing code...

export async function createUsers(numUsers, emailDomain, defaultPassword) {
  try {
    const batch = [];
    
    for (let i = 1; i <= numUsers; i++) {
      const email = `user${i}${emailDomain}`;
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);
      const user = userCredential.user;

      // Preparar datos para Firestore
      const userData = {
        name: `Usuario ${i}`,
        email: email,
        role: "user",
        edit_users: false,
        edit_news: true,
        edit_bone_files: false,
        active: true,
        is_first_login: true
      };

      // Guardar datos en Firestore
      await setDoc(doc(db, "users", user.uid), userData);
      batch.push(user.uid);
    }

    console.log(`${numUsers} usuarios creados correctamente`);
    return true;
  } catch (error) {
    console.error("Error al crear usuarios:", error.message);
    throw error;
  }
}

export async function createUser(collectionName, userData) {
  try {
      const data = JSON.parse(userData);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Guardar datos en Firestore sin la contraseña
      const { password, ...dataWithoutPassword } = data;
      await setDoc(doc(db, collectionName, user.uid), {
          uid: user.uid,
          ...dataWithoutPassword
      });

      console.log("Usuario creado correctamente");
      return true;
  } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
  }
}

export async function getUsers() {
  try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = [];
      querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
      });
      return users;
  } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
  }
}

export async function deleteUser(userId) {
  try {
      await deleteDoc(doc(db, "users", userId));
      return true;
  } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
  }
}

export async function updateUser(userId, userData) {
  try {
      await updateDoc(doc(db, 'users', userId), userData);
      console.log("Usuario actualizado correctamente");
      return true;
  } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
  }
};
