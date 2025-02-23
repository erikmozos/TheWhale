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

            window.location.href = "../pages/admin.html";
        } else {
            console.error("Usuari no trobat al sistema.");
        }
    });
});

function comparePassword() {
    const pass1 = $('#password').val();
    const pass2 = $('#confirmpassword').val();
    const errorMessage = $('#error-message');

    errorMessage.hide();

    if (pass1 !== pass2 || pass1 === '') {
        errorMessage.text("Las contraseñas no coinccideixen o estan buides");
        errorMessage.show();
        return null;
    }

    const isValidPassword = validatePassword(pass1);
    if (!isValidPassword) {
        errorMessage.text("La contrasenya ha de tenir al menys 12 caracters, amb majúscules, minúscules, nombres y caracteres especials.");
        errorMessage.show();
        return null;
    }

    return pass1;
}

