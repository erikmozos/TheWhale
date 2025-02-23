$(document).ready(function () {
    // --- VARIABLES GENERALES ---
    const storedUser = sessionStorage.getItem('user_logged_in');
    let loggedInUser = null;

    const $menuIcon = $('#menu-icon');
    const $mobileNavbar = $('.mobile-navbar');
    const $menuAcces = $('#accessibility-menu');
    const $accesBtn = $('#accessibility-btn');
    const $contrastSelect = $('#contrast');
    const $fontSizeInput = $('#font-size');
    const $lineSpacingInput = $('#line-spacing');
    const $wordSpacingInput = $('#word-spacing');
    const $letterSpacingInput = $('#letter-spacing');
    const $body = $('body');

    const MAX_FONT_SIZE = 1.2;
    const MAX_FONT_SPACING = 0.3;

    // Verificar si el elemento existe antes de manipularlo
    if ($menuAcces.length) {
        $menuAcces.hide();
    }

    // --- FUNCIONES DE ACCESIBILIDAD ---
    function applyAccessibilitySettings() {
        const contrast = localStorage.getItem('contrast');
        const fontSize = localStorage.getItem('fontSize');
        const lineSpacing = localStorage.getItem('lineSpacing');
        const wordSpacing = localStorage.getItem('wordSpacing');
        const letterSpacing = localStorage.getItem('letterSpacing');

        if (contrast) {
            $contrastSelect.val(contrast);
            applyContrast(contrast);
        }
        if (fontSize) {
            $body.css('fontSize', `${fontSize}em`);
            $fontSizeInput.val(fontSize);
        }
        if (lineSpacing) {
            $body.css('lineHeight', lineSpacing);
            $lineSpacingInput.val(lineSpacing);
        }
        if (wordSpacing) {
            $body.css('wordSpacing', `${wordSpacing}em`);
            $wordSpacingInput.val(wordSpacing);
        }
        if (letterSpacing) {
            $body.css('letterSpacing', `${letterSpacing}em`);
            $letterSpacingInput.val(letterSpacing);
        }
    }

    function applyContrast(option) {
        const $elements = $('header, main, footer');
        $elements.removeClass('element-grayscale element-dark element-light element-high-saturation element-low-saturation');

        if (option) {
            $elements.addClass(`element-${option}`);
        }

        localStorage.setItem('contrast', option);
    }

    // --- EVENT LISTENERS ---
    $menuIcon.on('click', () => {
        $mobileNavbar.toggleClass('show');
    });

    $(document).on('click', (e) => {
        if (!$mobileNavbar.is(e.target) && !$menuIcon.is(e.target)) {
            $mobileNavbar.removeClass('show');
        }
    });

    $accesBtn.on('click', () => {
        $menuAcces.toggle();
    });

    $contrastSelect.on('change', function() {
        const option = $(this).val();
        applyContrast(option);
    });

    $fontSizeInput.on('input', function() {
        let fontSize = parseFloat($(this).val());
        if (fontSize > MAX_FONT_SIZE) {
            fontSize = MAX_FONT_SIZE;
            $(this).val(fontSize);
        }

        $('main p, main h1, main h2, main h3, main li, main span, main a, footer p, footer a')
            .css('fontSize', `${fontSize}em`);

        localStorage.setItem('fontSize', fontSize);
    });

    $lineSpacingInput.on('input', function() {
        const lineSpacing = $(this).val();
        $body.css('lineHeight', lineSpacing);
        localStorage.setItem('lineSpacing', lineSpacing);
    });

    $wordSpacingInput.on('input', function() {
        const wordSpacing = $(this).val();
        $body.css('wordSpacing', `${wordSpacing}em`);
        localStorage.setItem('wordSpacing', wordSpacing);
    });

    $letterSpacingInput.on('input', function() {
        let letterSpacing = parseFloat($(this).val());
        if (letterSpacing > MAX_FONT_SPACING) {
            letterSpacing = MAX_FONT_SPACING;
            $(this).val(letterSpacing);
        }
        $body.css('letterSpacing', `${letterSpacing}em`);
        localStorage.setItem('letterSpacing', letterSpacing);
    });

    // Inicializar configuraciones de accesibilidad
    applyAccessibilitySettings();

    // --- MANEJO DE USUARIO ---
    if (storedUser) {
        try {
            loggedInUser = JSON.parse(storedUser);
            
            if (loggedInUser && loggedInUser.active) {
                const userRole = loggedInUser.name || "user";
                const $mobileNavMenu = $('header .mobile-navbar ul');
                const $primaryNavMenu = $('header .navbar ul');

                // Actualizar enlaces de login/logout
                $mobileNavMenu.find('#login-link')
                    .html('<i class="fa-solid fa-right-from-bracket"></i><a href="#" id="logout-link">Logout</a>');
                $primaryNavMenu.find('#login-link-desktop')
                    .html('<i class="fa-solid fa-right-from-bracket"></i><a href="#" id="logout-link-desktop">Logout</a>');

                // Añadir enlace de admin si corresponde
                if (userRole === "admin") {
                    const adminLinkHtml = `
                        <li>
                            <i class="fa-solid fa-user-shield" aria-hidden="true"></i>
                            <a href="/pages/admin.html" aria-label="Admin Panel">Admin Panel</a>
                        </li>`;
                    $mobileNavMenu.append(adminLinkHtml);
                    $primaryNavMenu.append(adminLinkHtml);
                }

                // Manejar logout
                $('#logout-link, #logout-link-desktop').on('click', function(e) {
                    e.preventDefault();
                    loggedInUser.active = false;
                    sessionStorage.setItem('user_logged_in', JSON.stringify(loggedInUser));
                    window.location.href = "/Exercici5/index.html";
                });
            }
        } catch (e) {
            console.error('Error al parsear los datos de sessionStorage:', e);
        }
    }
});