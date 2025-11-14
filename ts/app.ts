// -----------------------------
// Utilidades iniciales
// -----------------------------

document.getElementById('year')!.textContent = new Date().getFullYear().toString();

// Tipos
type TranslationMap = Record<string, string>;
let translations: TranslationMap = {};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -----------------------------
// Navegación y scroll
// -----------------------------

document.getElementById('btn-contact')?.addEventListener('click', () => {
  document.querySelector<HTMLElement>('#contacto')?.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('name')?.focus();
});

document.getElementById('btn-portfolio')?.addEventListener('click', () => {
  document.querySelector<HTMLElement>('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
});

// -----------------------------
// Formulario
// -----------------------------

function setupFormHandler(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const status = document.getElementById('formStatus') as HTMLElement | null;

  if (!form || !status) return;

  form.addEventListener('submit', async (ev: SubmitEvent) => {
    ev.preventDefault();
    status.textContent = '';

    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    const message = (document.getElementById('message') as HTMLTextAreaElement).value.trim();

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
      } else {
        status.textContent = t('form_status_error');
      }
    } catch (error) {
      status.textContent = t('form_status_network');
    }
  });
}

// Enviar por mail
document.getElementById('btn-mail')?.addEventListener('click', () => {
  const name = encodeURIComponent(
    (document.getElementById('name') as HTMLInputElement).value.trim() || 'Nombre'
  );
  const email = encodeURIComponent(
    (document.getElementById('email') as HTMLInputElement).value.trim() || 'correo@ejemplo.com'
  );

  const body = encodeURIComponent(
    `Hola,

Me llamo ${decodeURIComponent(name)} y quiero solicitar información sobre su servicio de creación de páginas web.

Email: ${decodeURIComponent(email)}`
  );

  window.location.href = `mailto:tucorreo@ejemplo.com?subject=Presupuesto%20web&body=${body}`;
});

// -----------------------------
// Tema oscuro/claro
// -----------------------------

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
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

const langSelect = document.getElementById('langSelect') as HTMLSelectElement | null;
const savedLang = localStorage.getItem('lang');
const browserLang = navigator.language.slice(0, 2);
const defaultLang = savedLang || (['es', 'en'].includes(browserLang) ? browserLang : 'es');

async function loadLanguage(lang: string): Promise<void> {
  try {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) throw new Error('Error al cargar JSON');

    translations = await response.json();

    applyTranslations();
    localStorage.setItem('lang', lang);

    if (langSelect) langSelect.value = lang;

    setupFormHandler();
  } catch (error) {
    console.error('Error cargando idioma:', error);
  }
}

function applyTranslations(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    if (translations[key]) el.innerHTML = translations[key];
  });

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]')
    .forEach((el) => {
      const key = el.dataset.i18nPlaceholder!;
      if (translations[key]) el.placeholder = translations[key];
    });
}

function t(key: string): string {
  return translations[key] ?? key;
}

langSelect?.addEventListener('change', (e) => {
  const lang = (e.target as HTMLSelectElement).value;
  loadLanguage(lang);
});

loadLanguage(defaultLang);

// -----------------------------
// Modal de precios
// -----------------------------

(function () {
  const modal = document.getElementById('priceModal')!;
  const modalTitle = document.getElementById('modalTitle') as HTMLElement;
  const modalPrice = document.getElementById('modalPrice') as HTMLElement;
  const modalBody = document.getElementById('modalBody') as HTMLElement;
  const closeBtn = modal.querySelector('.modal-close') as HTMLElement;

  function openPriceModal(key: string): void {
    modalTitle.textContent = t(`price_${key}_title`);
    modalPrice.textContent = t(`price_${key}_amount`);
    modalBody.innerHTML = t(`price_${key}_fulldesc`);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  document.querySelectorAll<HTMLElement>('.price').forEach((card) => {
    card.addEventListener('click', () => {
      const plan = card.dataset.plan;
      if (plan) openPriceModal(plan);
    });
  });

  function closeModal(): void {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
})();
