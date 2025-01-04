const procesDiv = document.querySelector('.proces');
const historiaDiv = document.querySelector('.historia');

// Añade evento de click para girar las tarjetas
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

// Avance automático cada 3 segundos
const autoSlide = setInterval(() => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
}, 3000); // 3000ms = 3 segundos

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    updateSlider();
    // Reinicia el avance automático al hacer clic
    clearInterval(autoSlide);
    setInterval(() => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateSlider();
    }, 3000);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
    // Reinicia el avance automático al hacer clic
    clearInterval(autoSlide);
    setInterval(() => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateSlider();
    }, 3000);
});
