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

  if (catalogFrame && catalogFallback) {
    // En muchos móviles el <iframe> de un PDF no puede renderizar:
    // si no carga en 1.5s, mostramos el mensaje alterno con el botón de descarga.
    const fallbackTimer = setTimeout(() => {
      catalogFallback.style.display = 'block';
    }, 1500);

    catalogFrame.addEventListener('load', () => {
      clearTimeout(fallbackTimer);
    });
  }

});