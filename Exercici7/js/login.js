import {userLogIn} from "./firebase.js";

    const emailInput = $('#email');
    const passwordInput = $('#password');

$(document).ready(function () {

    $('.login-container form').on("submit", function (e) {
        e.preventDefault();

        const email = emailInput.val().trim();
        const password = passwordInput.val().trim();


        const usersLogIn = userLogIn(email, password);

        if(usersLogIn){
            sessionStorage.setItem("user_logged_in", true);
        }



    });



















});