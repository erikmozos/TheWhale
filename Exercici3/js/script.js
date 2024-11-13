console.log("Es js va");

// Menu - Toggle the mobile navigation menu
const menuIcon = document.getElementById('menu-icon');
const mobileNavbar = document.querySelector('.mobile-navbar');

menuIcon.addEventListener('click', () => {
    mobileNavbar.classList.toggle('show');
});

// Menu de accessibilitat (Botó)
const menuacces = document.getElementById("accessibility-menu");
const accesbtn = document.getElementById("accessibility-btn");
menuacces.style.display = "none"; 
accesbtn.addEventListener("click", () => {
    menuacces.style.display = menuacces.style.display === "none" ? "block" : "none";
});

// Función para aplicar configuraciones de accesibilidad guardadas
function applyAccessibilitySettings() {
    const contrast = localStorage.getItem('contrast');
    const fontSize = localStorage.getItem('fontSize');
    const lineSpacing = localStorage.getItem('lineSpacing');
    const wordSpacing = localStorage.getItem('wordSpacing');
    const letterSpacing = localStorage.getItem('letterSpacing');
    
    // Aplica el contraste guardado
    if (contrast) {
        document.getElementById('contrast').value = contrast;
        applyContrast(contrast);
    }

    // Aplica el tamaño de fuente guardado
    if (fontSize) {
        document.body.style.fontSize = `${fontSize}em`;
        document.getElementById('font-size').value = fontSize;
    }

    // Aplica el espaciado de línea guardado
    if (lineSpacing) {
        document.body.style.lineHeight = lineSpacing;
        document.getElementById('line-spacing').value = lineSpacing;
    }

    // Aplica el espaciado de palabras guardado
    if (wordSpacing) {
        document.body.style.wordSpacing = `${wordSpacing}em`;
        document.getElementById('word-spacing').value = wordSpacing;
    }

    // Aplica el espaciado de letras guardado
    if (letterSpacing) {
        document.body.style.letterSpacing = `${letterSpacing}em`;
        document.getElementById('letter-spacing').value = letterSpacing;
    }
}

// Función para aplicar y guardar el contraste
function applyContrast(option) {
    const elements = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
    
    elements.forEach(element => {
        element.classList.remove(
            'element-grayscale',
            'element-dark',
            'element-light',
            'element-high-saturation',
            'element-low-saturation'
        );
    });
    
    elements.forEach(element => {
        switch(option) {
            case 'grayscale':
                element.classList.add('element-grayscale');
                break;
            case 'dark':
                element.classList.add('element-dark');
                break;
            case 'light':
                element.classList.add('element-light');
                break;
            case 'high-saturation':
                element.classList.add('element-high-saturation');
                break;
            case 'low-saturation':
                element.classList.add('element-low-saturation');
                break;
            default:
                break;
        }
    });

    // Guarda el contraste en localStorage
    localStorage.setItem('contrast', option);
}

// Event Listener para el cambio de contraste
document.getElementById('contrast').addEventListener('change', () => {
    const option = document.getElementById('contrast').value;
    applyContrast(option);
});

// Ajuste del tamaño de fuente y guardado en localStorage
const MAX_FONT_SPACING = 0.3;
const MAX_FONT_SIZE = 1.2;
const MAX_FONT_SIZE_HEADER = 1;
// Ajuste del tamaño de fuente y guardado en localStorage
document.getElementById('font-size').addEventListener('input', (e) => {
    let fontSize = parseFloat(e.target.value);

    if (fontSize > MAX_FONT_SIZE) {
        fontSize = MAX_FONT_SIZE;
        e.target.value = fontSize;
    }

    // Cambiar tamaño de fuente solo en el contenido, sin afectar el header ni el nav
    const contentElements = document.querySelectorAll('main p, main h1, main h2, main h3, main li, main span, main a, footer p, footer a');

    contentElements.forEach((el) => {
        el.style.fontSize = `${fontSize}em`;
        
    });

    // Guarda el tamaño de fuente en localStorage
    localStorage.setItem('fontSize', fontSize);
});




// Ajuste del espaciado de línea y guardado en localStorage
document.getElementById('line-spacing').addEventListener('input', (e) => {
    const lineSpacing = e.target.value;
    document.body.style.lineHeight = lineSpacing;
    localStorage.setItem('lineSpacing', lineSpacing);
});

// Ajuste del espaciado de palabras y guardado en localStorage
document.getElementById('word-spacing').addEventListener('input', (e) => {
    const wordSpacing = e.target.value;
    document.body.style.wordSpacing = `${wordSpacing}em`;
    localStorage.setItem('wordSpacing', wordSpacing);
});

// Ajuste del espaciado de letras y guardado en localStorage
document.getElementById('letter-spacing').addEventListener('input', (e) => {
    let letterSpacing = parseFloat(e.target.value);

    if (letterSpacing > MAX_FONT_SPACING) {
        letterSpacing = MAX_FONT_SPACING;
        e.target.value = letterSpacing; // Actualiza el valor del input
    }
    document.body.style.letterSpacing = `${letterSpacing}em`;

    localStorage.setItem('letter-Spacing', letterSpacing);
});

// Aplica configuraciones de accesibilidad guardadas al cargar la página
document.addEventListener('DOMContentLoaded', applyAccessibilitySettings);

console.log("Es js va");
