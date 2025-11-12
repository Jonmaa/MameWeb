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

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    status.textContent = '';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if(!name || !email || !message) {
      status.textContent = 'Por favor completa los campos obligatorios.';
      return;
    }
    if(!validateEmail(email)){
      status.textContent = 'El email no tiene formato válido.';
      return;
    }

    // Simular envío: como no hay backend, usamos mailto como fallback dinámico y guardamos una copia en localStorage
    const subject = encodeURIComponent('Solicitud de presupuesto - ' + name);
    let body = 'Nombre: ' + name + '\n';
    body += 'Email: ' + email + '\n';
    if(phone) body += 'Teléfono: ' + phone + '\n';
    body += '\nMensaje:\n' + message;

    // Guardar en localStorage 
    try {
      const saves = JSON.parse(localStorage.getItem('mameweb_submissions') || '[]');
      saves.push({name, email, phone, message, at: new Date().toISOString()});
      localStorage.setItem('mameweb_submissions', JSON.stringify(saves));
    } catch(e){
      // ignorar
    }

    // Abrir cliente mail
    const mailto = 'mailto:tucorreo@ejemplo.com?subject=' + subject + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;

    status.textContent = 'Se ha abierto tu cliente de correo. Si no aparece, copia y pega el mensaje en tu email.';
  });

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
    const defaultLang = localStorage.getItem('lang') || navigator.language.slice(0, 2) || 'es';
    let translations = {};

    async function loadLanguage(lang) {
      try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`Error al cargar ${lang}.json`);
        translations = await response.json();
        applyTranslations();
        localStorage.setItem('lang', lang);
        if (langSelect) langSelect.value = lang;
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

    if (langSelect) {
      langSelect.addEventListener('change', e => {
        loadLanguage(e.target.value);
      });
    }


    // Carga inicial del idioma
    loadLanguage(defaultLang);

})();
