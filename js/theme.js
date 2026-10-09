/* Alternador de apariencia: el contenido sigue en data/cv.json. */
(function () {
  'use strict';
  const key = 'cv_theme';
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  const label = document.getElementById('theme-toggle-label');
  const cardsSelector = '.project-card';
  const safeGet = () => {
    try { return localStorage.getItem(key); }
    catch (_) { return null; }
  };
  const safeSet = value => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };
  function apply(theme) {
    const gamer = theme === 'gamer';
    document.body.classList.toggle('theme-gamer', gamer);
    document.documentElement.style.colorScheme = gamer ? 'dark' : 'light';
    button.setAttribute('aria-pressed', String(gamer));
    button.setAttribute('aria-label', gamer ? 'Cambiar a modo Profesional' : 'Cambiar a modo Gamer');
    if (label) label.textContent = gamer ? 'Modo Profesional' : 'Modo Gamer';
    safeSet(gamer ? 'gamer' : 'professional');
  }
  apply(safeGet() === 'gamer' ? 'gamer' : 'professional');
  button.addEventListener('click', () => {
    apply(document.body.classList.contains('theme-gamer') ? 'professional' : 'gamer');
  });
  // El brillo sigue el cursor solo en el modo Gamer, sin afectar los enlaces ni el contenido.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('pointermove', event => {
    if (!document.body.classList.contains('theme-gamer') || event.pointerType === 'touch') return;
    const card = event.target.closest(cardsSelector);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--mx', (100 * x).toFixed(1) + '%');
    card.style.setProperty('--my', (100 * y).toFixed(1) + '%');
    card.style.setProperty('--rx', ((.5 - y) * 3.2).toFixed(2) + 'deg');
    card.style.setProperty('--ry', ((x - .5) * 3.2).toFixed(2) + 'deg');
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    const card = event.target.closest(cardsSelector);
    if (card && !card.contains(event.relatedTarget)) {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    }
  });
})();
