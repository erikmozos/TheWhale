import { createUser, hasUsers  } from "./firebase.js";

$(document).ready(function() {
    
  hasUsers().then(hasUsers =>{
        if(hasUsers) {
            console.log("Hay");
        }else{
            defaultUser();
            console.log("No hay usuarios");
        }
    }  
    );
});



function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }
  
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
  
    createUser('users', JSON.stringify(defaultUser));
    console.log("Usuario por defecto creado.");
  }