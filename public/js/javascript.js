(function(){
  document.getElementById('year').textContent = new Date().getFullYear();

  // Botones en Hero
  document.getElementById('btn-contact').addEventListener('click', function(){
    document.querySelector('#contacto').scrollIntoView({behavior:'smooth'});
    document.getElementById('name').focus();
  });
  document.getElementById('btn-portfolio').addEventListener('click', function(){
    document.querySelector('#portfolio').scrollIntoView({behavior:'smooth'});
  });

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setupFormHandler() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', async function(ev) {
      ev.preventDefault();
      status.textContent = '';
  
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if(!name || !email || !message) {
        status.textContent = t('form_status_required');
        return;
      }
      if(!validateEmail(email)) {
        status.textContent = t('form_status_invalid_email');
        return;
      }

      const data = { name, email, phone, message };

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          status.textContent = t('form_status_success');
          form.reset();
        } else {
          status.textContent = t('form_status_error');
        }
      } catch (error) {
        status.textContent = t('form_status_network');
      }
    });
  }



  // Botón para abrir el mail por defecto con los datos rellenados
  document.getElementById('btn-mail').addEventListener('click', function(){
    const name = encodeURIComponent(document.getElementById('name').value.trim() || 'Nombre');
    const email = encodeURIComponent(document.getElementById('email').value.trim() || 'correo@ejemplo.com');
    const body = encodeURIComponent('Hola,%0A%0AMe llamo ' + decodeURIComponent(name) + ' y quiero solicitar información sobre su servicio de creación de páginas web.%0A%0AEmail: ' + decodeURIComponent(email));
    window.location.href = 'mailto:tucorreo@ejemplo.com?subject=Presupuesto%20web&body=' + body;
  });

  // Accesibilidad
  (function(){
    const style = document.createElement('style');
    style.innerHTML = 'button:focus, a:focus, input:focus, textarea:focus {outline: 3px solid rgba(31,182,255,0.18);outline-offset:3px;border-radius:8px;}';
    document.head.appendChild(style);
  })();

  // Detecta el tema guardado o el del sistema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Toggle botón
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // -----------------------------
  // 🌐 Gestión de idiomas (i18n)
  // -----------------------------

  const langSelect = document.getElementById('langSelect');
  const savedLang = localStorage.getItem('lang');
  const browserLang = navigator.language.slice(0, 2);
  const defaultLang = savedLang || (['es', 'en'].includes(browserLang) ? browserLang : 'es');
  let translations = {};

  async function loadLanguage(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      if (!response.ok) throw new Error(`Error al cargar ${lang}.json`);
      translations = await response.json();
      applyTranslations();
      localStorage.setItem('lang', lang);
      if (langSelect) langSelect.value = lang;
      setupFormHandler();

    } catch (error) {
      console.error('Error cargando idioma:', error);
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.innerHTML = translations[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) el.placeholder = translations[key];
    });
  }

  function t(key) {
    return translations[key] || key;
  }


  if (langSelect) {
    langSelect.addEventListener('change', e => {
      loadLanguage(e.target.value);
    });
  }


  // Carga inicial del idioma
  loadLanguage(defaultLang);

  // -----------------------------
  // 💰 Modal de precios con i18n
  // -----------------------------

  (function() {
    const modal = document.getElementById('priceModal');
    if (!modal) return; // si no existe, salir
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = modal.querySelector('.modal-close');

    // Abre el modal con los textos traducidos
    function openPriceModal(key) {
      modalTitle.textContent = t(`price_${key}_title`);
      modalPrice.textContent = t(`price_${key}_amount`);
      modalBody.innerHTML = t(`price_${key}_fulldesc`);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }

    // Detectar clic en las tarjetas
    document.querySelectorAll('.price').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.plan; 
        if (type) openPriceModal(type);
      });
    });

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }

    // Cerrar modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

  })();

})();
