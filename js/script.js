// ==========================================================================
// Graphic Center Plus — script principal
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Menú móvil ---
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // --- Animación al hacer scroll (reemplaza AOS, sin dependencias) ---
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Navegadores muy antiguos: mostrar todo directo
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // --- Catálogo: detectar si el visor de PDF embebido falla (típico en móvil) ---
  const catalogFrame = document.getElementById('catalogFrame');
  const catalogFallback = document.getElementById('catalogFallback');

  // --- Formulario de contacto: arma el mensaje y lo manda a WhatsApp o correo ---
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nameInput = document.getElementById('cf-name');
    const contactInput = document.getElementById('cf-contact');
    const serviceInput = document.getElementById('cf-service');
    const messageInput = document.getElementById('cf-message');

    // Si llegamos desde una tarjeta de servicio (ej. contacto.html?servicio=DTF%20Textil),
    // preseleccionamos esa opción en el formulario.
    const urlParams = new URLSearchParams(window.location.search);
    const preselected = urlParams.get('servicio');
    if (preselected && serviceInput) {
      const matchingOption = Array.from(serviceInput.options)
        .find(opt => opt.value === preselected);
      if (matchingOption) serviceInput.value = preselected;
    }

    const WHATSAPP_NUMBER = '50762037258'; 
    const CONTACT_EMAIL = 'ventas@graphiccenterpa.com'; 

    function buildMessage() {
      const name = nameInput.value.trim();
      const contact = contactInput.value.trim();
      const service = serviceInput.value;
      const message = messageInput.value.trim();

      let text = `Hola Graphic Center Plus, soy ${name}.`;
      if (service) text += `\nMe interesa: ${service}.`;
      if (message) text += `\nDetalle: ${message}`;
      if (contact) text += `\nMi contacto: ${contact}`;
      return text;
    }

    const waBtn = document.getElementById('sendWhatsapp');
    const mailBtn = document.getElementById('sendEmail');

    if (waBtn) {
      waBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!contactForm.reportValidity()) return;
        const text = encodeURIComponent(buildMessage());
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
      });
    }

    if (mailBtn) {
      mailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!contactForm.reportValidity()) return;
        const subject = encodeURIComponent('Solicitud desde la página web — Graphic Center Plus');
        const body = encodeURIComponent(buildMessage());
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      });
    }
  }

});