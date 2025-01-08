$(document).ready(function () {
    const userLoggedIn = JSON.parse(sessionStorage.getItem('user_logged_in')) || JSON.parse(localStorage.getItem('user_logged_in'));

    if (userLoggedIn) {
        console.log('User is logged in:', userLoggedIn);
    } else {
        console.log('User is not logged in');
        window.location.href = "../login.html";
        return; 
    }

    $('#changeButton').click((e) => {
        e.preventDefault();

        const newPassword = comparePassword();
        if (!newPassword) {
            return;
        }

        const salt = generateSalt();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === userLoggedIn.email);

        if (userIndex !== -1) {
            const hashedPassword = CryptoJS.SHA256(newPassword + salt).toString();
            users[userIndex].password_hash = hashedPassword;
            users[userIndex].salt = salt;
            users[userIndex].is_first_login = false;

            localStorage.setItem('users', JSON.stringify(users));
            console.log('Password updated successfully for:', users[userIndex]);

            const updatedUser = users[userIndex];
            sessionStorage.setItem('user_logged_in', JSON.stringify(updatedUser));

            alert("¡Contraseña actualizada con éxito!");
            window.location.href = "../pages/admin.html";
        } else {
            alert("Usuario no encontrado en el sistema.");
        }
    });
});

function comparePassword() {
    const pass1 = $('#password').val();
    const pass2 = $('#confirmpassword').val();

    if (pass1 !== pass2 || pass1 === '') {
        alert("Las contraseñas no coinciden o están vacías.");
        return null;
    }

    const isValidPassword = validatePassword(pass1);
    if (!isValidPassword) {
        alert("La contraseña debe tener al menos 12 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.");
        return null;
    }

    return pass1;
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return passwordRegex.test(password);
}

function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}
