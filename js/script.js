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

  // --- Catálogo: carrusel de imágenes ---
  const carousel = document.getElementById('catalogCarousel');

  if (carousel) {
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');
    const currentLabel = document.getElementById('carouselCurrent');
    const totalLabel = document.getElementById('carouselTotal');

    const lightbox = document.getElementById('catalogLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let index = 0;
    totalLabel.textContent = slides.length;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir a la página ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      currentLabel.textContent = index + 1;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      if (lightbox.classList.contains('is-open')) {
        lightboxImg.src = slides[index].querySelector('img').src;
      }
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    // Swipe táctil
    let touchStartX = null;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 40) goTo(diff < 0 ? index + 1 : index - 1);
      touchStartX = null;
    });

    // Lightbox (vista ampliada)
    function openLightbox() {
      lightboxImg.src = slides[index].querySelector('img').src;
      lightbox.classList.add('is-open');
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
    }

    slides.forEach(slide => slide.addEventListener('click', openLightbox));
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', () => goTo(index - 1));
    lightboxNext.addEventListener('click', () => goTo(index + 1));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    goTo(0);
  }

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

    const WHATSAPP_NUMBER = '50762037258'; // <-- reemplaza por tu número real (con código de país, sin + ni espacios)
    const CONTACT_EMAIL = 'ventas@graphiccenterpa.com'; // <-- reemplaza por tu correo real

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