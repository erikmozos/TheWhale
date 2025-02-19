import { userLogIn } from "./firebase.js";

$(document).ready(function () {
  $('.login-container form').on("submit", async function (e) { // ✅ `async` agregado aquí
    e.preventDefault();

    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    const userData = await userLogIn(email, password); // ✅ `await` agregado

    if (userData) {
      console.log("Login exitoso:", userData);
    } else {
      console.error("Error en login.");
    }
  });
});
