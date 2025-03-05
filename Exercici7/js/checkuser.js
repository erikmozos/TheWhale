import { hasUsers, createDefaultUser, auth, signOut, onAuthStateChanged } from "./firebase.js";

$(document).ready(function() {
  const getAbsoluteBasePath = function () {
    const path = window.location.pathname;
    const projectIndex = path.indexOf('/TheWhale/Exercici7');
    
    if (projectIndex !== -1) {
      return window.location.origin + path.substring(0, projectIndex + 10);
    } else {
      return window.location.origin + '/TheWhale/Exercici7';
    }
  };

  hasUsers().then(hasUsers => {
    if (hasUsers) {
      console.log("Usuarios existentes.");
    } else {
      createDefaultUser();
      console.log("No hay usuarios, creando por defecto...");
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Usuario autenticado:", user);

      const userData = JSON.parse(localStorage.getItem("user"));

      $('header nav ul li:nth-child(6) > a').html("Logout");

      if (userData?.role === "admin" || userData?.edit_users) {
        $('header nav ul').append(`<li style="margin-top: 15px "><a href= "${getAbsoluteBasePath()}/pages/admin.html">Admin Panel</a></li>`);
      }

      $('header nav ul li:nth-child(6) > a').click(function (e) {
        e.preventDefault();
        signOut(auth).then(() => {
          localStorage.removeItem("user");
          window.location.href = `${getAbsoluteBasePath()}/index.html`;
        }).catch((error) => {
          console.error("Error al cerrar sesión:", error);
        });
      });

    } else {
      console.log("No hay usuario autenticado.");
      $('header nav ul li:nth-child(6) > a').html("Log In");
    }
  });
});
