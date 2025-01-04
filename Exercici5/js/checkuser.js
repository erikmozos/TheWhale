$(document).ready( (e) => {

    if(sessionStorage.getItem('user_logged_in') === null) {

        defaultUser();
    }else{
        $('header > nav.mobile-navbar.show > ul > li:nth-child(6) > a').html("Logout");
        console.log("aña");
    }

    
    


});

function defaultUser() {
    if (!localStorage.getItem('users')) {
        const salt = generateSalt();
        const defaultUser = {
            id: 1,
            name: "admin",
            email: "desenvolupador@iesjoanramis.org",
            password_hash: CryptoJS.SHA256("Ramis.20" + salt).toString(),
            salt: salt,
            edit_users: true,
            edit_news: true,
            edit_bone_files: true,
            active: true,
            is_first_login: true
        };
        localStorage.setItem('users', JSON.stringify([defaultUser]));
        console.log("user created");
    }
}

function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}
