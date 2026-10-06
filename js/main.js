async function loadCV() {
  try {
    const response = await fetch('data/cv.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar data/cv.json');
    const cv = await response.json();

    document.getElementById('profile-name').textContent = cv.profile?.name ?? '';
    document.getElementById('profile-title').textContent = cv.profile?.title ?? '';

    const summary = document.getElementById('profile-summary');
    summary.innerHTML = '';
    (cv.profile?.summary ?? []).forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      summary.appendChild(p);
    });

    const skills = document.getElementById('skills-list');
    skills.innerHTML = '';
    (cv.skills ?? []).forEach(skill => {
      const item = document.createElement('span');
      item.className = 'chip';
      item.textContent = skill;
      skills.appendChild(item);
    });
  } catch (error) {
    console.error(error);
  }
}

function activateRevealEffects() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.getElementById('year').textContent = new Date().getFullYear();
loadCV();
activateRevealEffects();
