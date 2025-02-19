$(document).ready(function () {
    const emailInput = $('#email');
    const passwordInput = $('#password');
    const messageContainer = $('#message-container'); // Seleccionamos el contenedor para los mensajes

    $('.login-container form').on("submit", function (e) {
        e.preventDefault();

        const email = emailInput.val().trim();
        const password = passwordInput.val().trim();

        // Limpiar mensajes anteriores
        messageContainer.empty();

        if (!email || !password) {  
            messageContainer.html('<p class="text-red-600 font-bold">Per favor, introdueix un email i la contraseña.</p>');
            return;
        }

        if (!validateEmail(email)) {
            messageContainer.html('<p class="text-red-600 font-bold">Per favor, introdueix un email vàlid.</p>');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email);

        if (!user) {
            messageContainer.html('<p class="text-red-600 font-bold">Usuari no trobat. Verifica el teu email.</p>');
            return;
        }

        const hashedPassword = CryptoJS.SHA256(password + user.salt).toString();
        if (hashedPassword === user.password_hash) {
            messageContainer.html('<p class="text-green-600 font-bold">Inici de sesió exitós.</p>');

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

            if (!userLoggedIn.is_first_login) {
                window.location.href = "../pages/admin.html";
            } else {
                window.location.href = "../pages/logIn-changePassword.html";
            }
        } else {
            messageContainer.html('<p class="text-red-600 font-bold">Contraseña incorrecta. Inténtalo de nuevo.</p>');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
