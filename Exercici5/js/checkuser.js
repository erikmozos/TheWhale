$(document).ready((e) => {
    if (!localStorage.getItem('users') || JSON.parse(localStorage.getItem('users')).length === 0) {
        defaultUser();
    }

    const userLoggedIn = JSON.parse(sessionStorage.getItem('user_logged_in'));
    if (userLoggedIn) {
        $('header > nav.mobile-navbar.show > ul > li:nth-child(6) > a').html("Logout");
        console.log("Usuario logueado.");

        $('header > nav.mobile-navbar.show > ul > li:nth-child(6) > a').click(function (e) {
            e.preventDefault();
            sessionStorage.removeItem('user_logged_in');
            window.location.href = "../login.html";
        });
    } else {
        $('header > nav.mobile-navbar.show > ul > li:nth-child(6) > a').html("Log In");
    }
});

function defaultUser() {
    const salt = generateSalt();
    const hashedPassword = CryptoJS.SHA256("Ramis.20" + salt).toString();

    const defaultUser = {
        id: 1,
        name: "admin",
        email: "desenvolupador@iesjoanramis.org",
        password_hash: hashedPassword,
        salt: salt,
        edit_users: true,
        edit_news: true,
        edit_bone_files: true,
        active: true,
        is_first_login: true,
    };

    localStorage.setItem('users', JSON.stringify([defaultUser]));
    console.log("Usuario por defecto creado.");
}

function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

function applyPermissions(user) {
    if (!user.edit_users) {
        $('#edit-users-section').hide();
    }
    if (!user.edit_news) {
        $('#edit-news-section').hide();
    }
    if (!user.edit_bone_files) {
        $('#edit-files-section').hide();
    }
}

const userLoggedIn = JSON.parse(sessionStorage.getItem('user_logged_in'));
if (userLoggedIn) {
    applyPermissions(userLoggedIn);
}
