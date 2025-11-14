"use strict";
// -----------------------------
// Utilidades iniciales
// -----------------------------
document.getElementById('year').textContent = new Date().getFullYear().toString();
let translations = {};
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// -----------------------------
// Navegación y scroll
// -----------------------------
document.getElementById('btn-contact')?.addEventListener('click', () => {
    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('name')?.focus();
});
document.getElementById('btn-portfolio')?.addEventListener('click', () => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
});
// -----------------------------
// Formulario
// -----------------------------
function setupFormHandler() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status)
        return;
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        status.textContent = '';
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) {
            status.textContent = t('form_status_required');
            return;
        }
        if (!validateEmail(email)) {
            status.textContent = t('form_status_invalid_email');
            return;
        }
        const data = { name, email, phone, message };
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                status.textContent = t('form_status_success');
                form.reset();
            }
            else {
                status.textContent = t('form_status_error');
            }
        }
        catch (error) {
            status.textContent = t('form_status_network');
        }
    });
}
// Enviar por mail
document.getElementById('btn-mail')?.addEventListener('click', () => {
    const name = encodeURIComponent(document.getElementById('name').value.trim() || 'Nombre');
    const email = encodeURIComponent(document.getElementById('email').value.trim() || 'correo@ejemplo.com');
    const body = encodeURIComponent(`Hola,

Me llamo ${decodeURIComponent(name)} y quiero solicitar información sobre su servicio de creación de páginas web.

Email: ${decodeURIComponent(email)}`);
    window.location.href = `mailto:tucorreo@ejemplo.com?subject=Presupuesto%20web&body=${body}`;
});
// -----------------------------
// Tema oscuro/claro
// -----------------------------
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
document.getElementById('themeToggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});
// -----------------------------
// i18n
// -----------------------------
const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem('lang');
const browserLang = navigator.language.slice(0, 2);
const defaultLang = savedLang || (['es', 'en'].includes(browserLang) ? browserLang : 'es');
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok)
            throw new Error('Error al cargar JSON');
        translations = await response.json();
        applyTranslations();
        localStorage.setItem('lang', lang);
        if (langSelect)
            langSelect.value = lang;
        setupFormHandler();
    }
    catch (error) {
        console.error('Error cargando idioma:', error);
    }
}
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (translations[key])
            el.innerHTML = translations[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]')
        .forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[key])
            el.placeholder = translations[key];
    });
}
function t(key) {
    return translations[key] ?? key;
}
langSelect?.addEventListener('change', (e) => {
    const lang = e.target.value;
    loadLanguage(lang);
});
loadLanguage(defaultLang);
// -----------------------------
// Modal de precios
// -----------------------------
(function () {
    const modal = document.getElementById('priceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = modal.querySelector('.modal-close');
    function openPriceModal(key) {
        modalTitle.textContent = t(`price_${key}_title`);
        modalPrice.textContent = t(`price_${key}_amount`);
        modalBody.innerHTML = t(`price_${key}_fulldesc`);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
    document.querySelectorAll('.price').forEach((card) => {
        card.addEventListener('click', () => {
            const plan = card.dataset.plan;
            if (plan)
                openPriceModal(plan);
        });
    });
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            closeModal();
    });
})();
