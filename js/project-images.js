/* Amplía imágenes de proyectos sin navegar fuera del CV. El enlace sirve como respaldo. */
(() => {
  'use strict';
  const modal = document.getElementById('project-lightbox');
  const title = document.getElementById('project-lightbox-title');
  const image = document.getElementById('project-lightbox-image');
  const fullLink = document.getElementById('project-lightbox-link');
  const closeButton = document.getElementById('project-lightbox-close');
  if (!modal || !title || !image || !fullLink || !closeButton) return;

  const isProjectImage = value => /^assets\/projects\/[a-z0-9-]+\.svg$/i.test(value);
  let lastTrigger = null;
  document.addEventListener('click', event => {
    const a = event.target.closest('a.project-image-btn');
    if (!a) return;
    const url = a.getAttribute('href');
    if (!isProjectImage(url || '') || typeof modal.showModal !== 'function') return;
    event.preventDefault();
    lastTrigger = a;
    title.textContent = a.dataset.projectTitle || 'Imagen del proyecto';
    image.src = url;
    image.alt = a.dataset.projectAlt || title.textContent;
    fullLink.href = url;
    modal.showModal();
    closeButton.focus();
  });
  closeButton.addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener('close', () => {
    image.removeAttribute('src');
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
  });
})();
