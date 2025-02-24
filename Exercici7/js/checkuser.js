import { hasUsers, createDefaultUser, auth, signOut, onAuthStateChanged } from "./firebase.js"; // ✅ Importando `auth`

$(document).ready(function() {

  const getAbsoluteBasePath = function () {
    return window.location.origin + '/Exercici7' + '/';
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

      // Obtener datos del usuario desde localStorage
      const userData = JSON.parse(localStorage.getItem("user"));

      // Cambiar "Login" a "Logout"
      $('header nav ul li:nth-child(6) > a').html("Logout");

      // Mostrar "Admin Panel" si el usuario es admin
  
      if (userData?.role === "admin" || userData?.edit_users) {
        $('header nav ul').append(`<li style="margin-top: 15px "><a href= "${getAbsoluteBasePath()}pages/admin.html">Admin Panel</a></li>`);
      }

      // Logout
      $('header nav ul li:nth-child(6) > a').click(function (e) {
        e.preventDefault();
        signOut(auth).then(() => {
          localStorage.removeItem("user");
          window.location.href = `${getAbsoluteBasePath()}index.html`;
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
