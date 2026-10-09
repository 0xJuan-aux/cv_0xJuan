/* Ambientacion discreta en Canvas 2D, solo para el modo Profesional. */
(() => {
  'use strict';
  const hero = document.querySelector('#inicio.hero');
  const canvas = document.getElementById('professional-particles');
  if (!hero || !canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1;
  let height = 1;
  let nodes = [];
  let frame = null;
  let last = 0;
  let elapsed = 0;
  let visible = true;
  let cursor = { x: -1000, y: -1000 };
  const isProfessional = () => !document.body.classList.contains('theme-gamer');
  const canAnimate = () => isProfessional() && !motionQuery.matches && !document.hidden && visible;
  function setup() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(rect.width, 1);
    height = Math.max(rect.height, 1);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = width < 650 ? 12 : 23;
    nodes = Array.from({ length: count }, (_, i) => ({
      x: ((i * 137.508) % 100) * width / 100,
      y: ((i * 83.92 + 21) % 100) * height / 100,
      a: .6 + (i % 5) * .16,
      phase: i * 1.6,
      r: i % 5 === 0 ? 2.5 : 1.4
    }));
    draw();
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const time = elapsed * .001;
    const pts = nodes.map(node => ({
      x: node.x + Math.sin(time * .22 + node.phase) * (12 * node.a),
      y: node.y + Math.cos(time * .18 + node.phase * 1.15) * (14 * node.a),
      r: node.r
    }));
    const maxDist = width < 650 ? 138 : 190;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance >= maxDist) continue;
        const nearCursor = Math.min(Math.hypot((a.x + b.x)/2 - cursor.x, (a.y + b.y)/2 - cursor.y), 230);
        const alpha = .035 + (1-distance/maxDist)*.16 + (1-nearCursor/230)*.045;
        ctx.strokeStyle = 'rgba(39,119,146,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.fillStyle = i % 4 === 0 ? 'rgba(37,137,151,.33)' : 'rgba(36,112,150,.23)';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function tick(timestamp) {
    if (!canAnimate()) { frame = null; return; }
    if (timestamp - last >= 33) {
      elapsed += Math.min(timestamp - last || 33, 60);
      last = timestamp;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (canAnimate()) {
      if (frame === null) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    } else {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (isProfessional()) draw();
    }
  }
  hero.addEventListener('pointermove', e => {
    if (!isProfessional()) return;
    const r = hero.getBoundingClientRect();
    cursor.x = e.clientX - r.left;
    cursor.y = e.clientY - r.top;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { cursor.x = -1000; cursor.y = -1000; });
  // Un halo muy tenue acompana el mouse en las tarjetas profesionales.
  document.addEventListener('pointermove', e => {
    if (!isProfessional() || e.pointerType === 'touch') return;
    const card = e.target.closest('.project-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--pro-x', (e.clientX - rect.left).toFixed(0) + 'px');
    card.style.setProperty('--pro-y', (e.clientY - rect.top).toFixed(0) + 'px');
  }, { passive: true });
  new MutationObserver(sync).observe(document.body, { attributes:true, attributeFilter:['class'] });
  document.addEventListener('visibilitychange', sync);
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      sync();
    }, { threshold: 0 }).observe(hero);
  }
  if ('ResizeObserver' in window) new ResizeObserver(setup).observe(hero);
  else window.addEventListener('resize', setup, { passive:true });
  setup();
  sync();
})();
