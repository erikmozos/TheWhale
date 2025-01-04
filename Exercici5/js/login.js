$(document).ready(function () {
    const emailInput = $('#email');
    const passwordInput = $('#password');

    $('.login-container form').on("submit",function (e) {
        e.preventDefault();

        const email = emailInput.val().trim();
        const password = passwordInput.val().trim();

        if (!email || !password) {  
            alert('Introdueix les dades.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Introdueix un email vàlid.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email);

        if (!user) {
            alert('Usuario no encontrado.');
            return;
        }

        const hashedPassword = CryptoJS.SHA256(password + user.salt).toString();
        if (hashedPassword === user.password_hash) {
            alert('Inicio de sesión exitoso.');

            const userLoggedIn = {
                id: user.id,
                name: user.name,
                email: user.email,
                edit_users: user.edit_users,
                edit_news: user.edit_news,
                edit_bone_files: user.edit_bone_files,
                active: user.active,
                is_first_login: user.is_first_login
            };

            sessionStorage.setItem('user_logged_in', JSON.stringify(userLoggedIn));

            console.log("Usuario logueado:", userLoggedIn);

            if(!userLoggedIn.is_first_login){
                window.location.href = "../index.html";
            }else{
                window.location.href = "../pages/logIn-changePassword.html";
            }
        } else {
            alert('Contraseña incorrecta.');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
