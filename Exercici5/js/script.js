const menuIcon = document.getElementById('menu-icon');
const mobileNavbar = document.querySelector('.mobile-navbar');
const menuacces = document.getElementById("accessibility-menu");
const accesbtn = document.getElementById("accessibility-btn");
const contrastSelect = document.getElementById('contrast');
const fontSizeInput = document.getElementById('font-size');
const lineSpacingInput = document.getElementById('line-spacing');
const wordSpacingInput = document.getElementById('word-spacing');
const letterSpacingInput = document.getElementById('letter-spacing');

menuacces.style.display = "none";

menuIcon.addEventListener('click', () => {
    mobileNavbar.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!mobileNavbar.contains(e.target) && e.target !== menuIcon) {
        mobileNavbar.classList.remove('show');
    }
});

accesbtn.addEventListener("click", () => {
    menuacces.style.display = menuacces.style.display === "none" ? "block" : "none";
});

function applyAccessibilitySettings() {
    const contrast = localStorage.getItem('contrast');
    const fontSize = localStorage.getItem('fontSize');
    const lineSpacing = localStorage.getItem('lineSpacing');
    const wordSpacing = localStorage.getItem('wordSpacing');
    const letterSpacing = localStorage.getItem('letterSpacing');

    if (contrast) {
        contrastSelect.value = contrast;
        applyContrast(contrast);
    }
    if (fontSize) {
        document.body.style.fontSize = `${fontSize}em`;
        fontSizeInput.value = fontSize;
    }
    if (lineSpacing) {
        document.body.style.lineHeight = lineSpacing;
        lineSpacingInput.value = lineSpacing;
    }
    if (wordSpacing) {
        document.body.style.wordSpacing = `${wordSpacing}em`;
        wordSpacingInput.value = wordSpacing;
    }
    if (letterSpacing) {
        document.body.style.letterSpacing = `${letterSpacing}em`;
        letterSpacingInput.value = letterSpacing;
    }
}

function applyContrast(option) {
    const elements = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
    elements.forEach(element => {
        element.classList.remove('element-grayscale', 'element-dark', 'element-light', 'element-high-saturation', 'element-low-saturation');
    });

    if (option) {
        elements.forEach(element => {
            element.classList.add(`element-${option}`);
        });
    }

    localStorage.setItem('contrast', option);
}

contrastSelect.addEventListener('change', () => {
    const option = contrastSelect.value;
    applyContrast(option);
});

const MAX_FONT_SIZE = 1.2;
const MAX_FONT_SPACING = 0.3;

fontSizeInput.addEventListener('input', (e) => {
    let fontSize = parseFloat(e.target.value);
    if (fontSize > MAX_FONT_SIZE) {
        fontSize = MAX_FONT_SIZE;
        e.target.value = fontSize;
    }

    const contentElements = document.querySelectorAll('main p, main h1, main h2, main h3, main li, main span, main a, footer p, footer a');
    contentElements.forEach((el) => {
        el.style.fontSize = `${fontSize}em`;
    });

    localStorage.setItem('fontSize', fontSize);
});

lineSpacingInput.addEventListener('input', (e) => {
    const lineSpacing = e.target.value;
    document.body.style.lineHeight = lineSpacing;
    localStorage.setItem('lineSpacing', lineSpacing);
});

wordSpacingInput.addEventListener('input', (e) => {
    const wordSpacing = e.target.value;
    document.body.style.wordSpacing = `${wordSpacing}em`;
    localStorage.setItem('wordSpacing', wordSpacing);
});

letterSpacingInput.addEventListener('input', (e) => {
    let letterSpacing = parseFloat(e.target.value);
    if (letterSpacing > MAX_FONT_SPACING) {
        letterSpacing = MAX_FONT_SPACING;
        e.target.value = letterSpacing;
    }
    document.body.style.letterSpacing = `${letterSpacing}em`;

    localStorage.setItem('letterSpacing', letterSpacing);
});

document.addEventListener('DOMContentLoaded', applyAccessibilitySettings);
$(document).ready(function () {
    const storedUser = sessionStorage.getItem('user_logged_in');
    let loggedInUser = null;

    if (storedUser) {
        try {
            loggedInUser = JSON.parse(storedUser);
        } catch (e) {
            console.error('Error al parsear los datos de sessionStorage', e);
            return;
        }
    }

    console.log('Usuario cargado:', loggedInUser);

    if (loggedInUser && loggedInUser.active) {
        const userRole = loggedInUser.name || "user";

        // Reemplazar los enlaces 'Log In' con 'Logout' en los menús de navegación (móvil y escritorio)
        const mobileNavMenu = $('header .mobile-navbar ul');
        const primaryNavMenu = $('header .navbar ul');
        
        // Reemplazar "Log In" con "Logout" en el menú móvil
        mobileNavMenu.find('#login-link').html('<i class="fa-solid fa-right-from-bracket"></i><a href="#" id="logout-link">Logout</a>');
        
        // Reemplazar "Log In" con "Logout" en el menú de escritorio
        primaryNavMenu.find('#login-link-desktop').html('<i class="fa-solid fa-right-from-bracket"></i><a href="#" id="logout-link-desktop">Logout</a>');

        // Si el usuario es admin, agregar el enlace al panel de administración
        if (userRole === "admin") {
            const adminLinkHtml = `
                <li>
                    <i class="fa-solid fa-user-shield" aria-hidden="true"></i>
                    <a href="/pages/admin.html" aria-label="Admin Panel">Admin Panel</a>
                </li>`;
            mobileNavMenu.append(adminLinkHtml);
            primaryNavMenu.append(adminLinkHtml);
        }

        // Manejador de clic en logout (móvil y escritorio)
        $('#logout-link, #logout-link-desktop').click(function (e) {
            e.preventDefault();

            // Desactivar el usuario en sessionStorage
            loggedInUser.active = false;
            sessionStorage.setItem('user_logged_in', JSON.stringify(loggedInUser));

            // Redirigir a la página de inicio de sesión
            window.location.href = "/Exercici5/index.html"; // O location.reload();
        });
    } else {
        console.error("No se encontró un usuario activo.");
    }

    // Lógica para el menú de navegación en dispositivos móviles
    const menuIcon = document.getElementById('menu-icon');
    const mobileNavbar = document.querySelector('.mobile-navbar');

    menuIcon.addEventListener('click', () => {
        mobileNavbar.classList.toggle('show'); // Alterna la visibilidad del menú móvil
    });

    // Cierra el menú cuando el usuario hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (!mobileNavbar.contains(e.target) && e.target !== menuIcon) {
            mobileNavbar.classList.remove('show');
        }
    });
});
