
    // Selecciona los divs
const procesDiv = document.querySelector('.proces');
const historiaDiv = document.querySelector('.historia');

// Añade evento de click para girar
procesDiv.addEventListener('click', () => {
    procesDiv.classList.toggle('active'); 
});

historiaDiv.addEventListener('click', () => {
    historiaDiv.classList.toggle('active');
});


// Image Slider
const slider = document.querySelector('.slider');
const images = slider.querySelectorAll('img');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentIndex = 0;

function updateSlider() {
    const offset = -currentIndex * 100; 
    slider.style.transform = `translateX(${offset}%)`;
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1; 
    updateSlider();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0; 
    updateSlider();
});

//Menu 

const menuIcon = document.getElementById('menu-icon');
const mobileNavbar = document.querySelector('.mobile-navbar');

menuIcon.addEventListener('click', () => {
    mobileNavbar.classList.toggle('show');
});

const cards = document.querySelectorAll('.card');

// Inicia la animación de botar solo en dispositivos móviles
window.onload = () => {
    if (window.innerWidth < 768) { // Para dispositivos móviles
        cards.forEach(card => {
            card.classList.add('bounce');
        });
    }
};

