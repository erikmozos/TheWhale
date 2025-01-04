$(document).ready(function () {
    // Verificar si el usuario está logueado desde sessionStorage o localStorage
    const userLoggedIn = JSON.parse(sessionStorage.getItem('user_logged_in')) || JSON.parse(localStorage.getItem('user_logged_in'));

    if (userLoggedIn) {
        console.log('User is logged in:', userLoggedIn);
    } else {
        console.log('User is not logged in');
        // Si no hay usuario logueado, redirigir a la página de login
        window.location.href = "../login.html";
        return; // Detener ejecución
    }

    // Manejar el evento de cambio de contraseña
    $('#changeButton').click((e) => {

        e.preventdefault();
        const newPassword = comparePassword(); // Validar contraseñas
        const salt = generateSalt();

        if (newPassword) {
            // Recuperar la lista de usuarios almacenados
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Buscar el usuario logueado dentro del arreglo
            const userIndex = users.findIndex(user => user.email === userLoggedIn.email); // Basado en el email u otra clave única

            if (userIndex !== -1) {
                // Crear un hash simple para la contraseña (en un entorno real, usar una librería robusta)
                const hashedPassword = CryptoJS.SHA256(newPassword + salt).toString();

                // Actualizar la información del usuario
                users[userIndex].password_hash = hashedPassword; // Actualizar el hash de la contraseña
                users[userIndex].is_first_login = false; // Marcar que no es el primer inicio de sesión

                // Guardar los cambios en localStorage
                localStorage.setItem('users', JSON.stringify(users));
                console.log('Password updated successfully for:', users[userIndex]);

                alert("Password updated successfully!");
                window.location.href = "../index.html";
            } else {
                alert("User not found in the system.");
            }
        } else {
            alert("Passwords do not match or are empty.");
        }
    });
});

function comparePassword() {
    const pass1 = $('#password').val();
    const pass2 = $('#confirmpassword').val();

    if (pass1 === pass2 && pass1 !== '') {
        return pass1; 
    }
    return null; 
}

function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}
