import { updatePassword } from "./firebase.js";
import { doc, updateDoc } from "./firebase.js";
import { auth, db } from "./firebase.js";

$(document).ready(async function () {
    const userLoggedIn = JSON.parse(sessionStorage.getItem('user_logged_in')) || JSON.parse(localStorage.getItem('user'));

    if (!userLoggedIn) {
        console.log('Usuario no autenticado, redirigiendo...');
        window.location.href = "../pages/logIn.html";
        return;
    }

    console.log('Usuario autenticado:', userLoggedIn);

    $('#changeButton').click(async (e) => {
        e.preventDefault();

        const newPassword = comparePassword();
        if (!newPassword) return; // Si la validación falla, se detiene aquí.

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No hay usuario autenticado en Firebase");

            // Actualizar la contraseña en Firebase Authentication
            await updatePassword(user, newPassword);

            // Actualizar Firestore para indicar que ya no es el primer inicio de sesión
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { is_first_login: false });

            console.log("Contraseña actualizada correctamente.");
            alert("Tu contraseña ha sido actualizada con éxito.");
            
            // Redirigir al usuario después del cambio de contraseña
            window.location.href = "../index.html"; 

        } catch (error) {
            console.error("Error al cambiar la contraseña:", error.message);
            alert("Error al cambiar la contraseña: " + error.message);
        }
    });
});

function comparePassword() {
    const pass1 = $('#password').val();
    const pass2 = $('#confirmpassword').val();
    const errorMessage = $('#error-message');

    errorMessage.hide();

    if (pass1 !== pass2 || pass1 === '') {
        errorMessage.text("Las contraseñas no coinciden o están vacías.");
        errorMessage.show();
        return null;
    }

    if (!validatePassword(pass1)) {
        errorMessage.text("La contraseña debe tener al menos 12 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.");
        errorMessage.show();
        return null;
    }

    return pass1;
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return passwordRegex.test(password);
}
