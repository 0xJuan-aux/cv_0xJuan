function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadCV() {
  try {
    const response = await fetch('data/cv.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar data/cv.json');
    const cv = await response.json();

    const firstName = document.getElementById('profile-first-name');
    if (firstName) firstName.textContent = (cv.profile?.name ?? 'Juan de Dios').replace(/\s+Castro.*$/i, '');

    const summary = document.getElementById('profile-summary');
    summary.innerHTML = '';
    (cv.profile?.summary ?? []).forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      summary.appendChild(p);
    });

    const experience = document.getElementById('experience-list');
    experience.innerHTML = '';
    (cv.experience ?? []).forEach(job => {
      const item = document.createElement('article');
      item.className = 'experience-item';
      const responsibilities = (job.responsibilities ?? []).length
        ? `<ul>${job.responsibilities.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`
        : '<p class="location">Experiencia en Business Intelligence y análisis de datos.</p>';
      item.innerHTML = `
        <div>
          <h3>${escapeHtml(job.role)}</h3>
          <p class="company">${escapeHtml(job.company)}</p>
          <p class="period">${escapeHtml(job.start)} - ${escapeHtml(job.end)}</p>
          ${job.location ? `<p class="location">${escapeHtml(job.location)}</p>` : ''}
        </div>
        <div class="job-details">
          ${responsibilities}
          ${(job.skills ?? []).length ? `<p class="job-skills">${job.skills.map(escapeHtml).join(' · ')}</p>` : ''}
        </div>
      `;
      experience.appendChild(item);
    });

    const projects = document.getElementById('projects-list');
    projects.innerHTML = '';
    (cv.projects ?? []).forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.innerHTML = `
        <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
      `;
      if (typeof project.image === 'string' && /^assets\/projects\/[a-z0-9-]+\.svg$/i.test(project.image)) {
        const viewImage = document.createElement('a');
        viewImage.className = 'project-image-btn';
        viewImage.href = project.image;
        viewImage.textContent = 'Ver imagen ↗';
        viewImage.dataset.projectTitle = project.title;
        viewImage.dataset.projectAlt = project.image_alt || project.title;
        viewImage.setAttribute('aria-label', 'Ver imagen del proyecto ' + project.title);
        card.appendChild(viewImage);
      }
      projects.appendChild(card);
    });

    const skills = document.getElementById('skills-list');
    skills.innerHTML = '';
    (cv.skills ?? []).forEach(skill => {
      const span = document.createElement('span');
      span.className = 'skill';
      span.textContent = skill;
      skills.appendChild(span);
    });

    const education = document.getElementById('education-list');
    education.innerHTML = '';
    (cv.education ?? []).forEach(ed => {
      const item = document.createElement('article');
      item.className = 'education-item';
      item.innerHTML = `
        <div>
          <h3>${escapeHtml(ed.level)}</h3>
          <p class="company">${escapeHtml(ed.institution)}</p>
        </div>
        <div>
          <p class="period">${escapeHtml(ed.start)}${ed.end ? ' - ' + escapeHtml(ed.end) : ''}</p>
        </div>
      `;
      education.appendChild(item);
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
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.getElementById('year').textContent = new Date().getFullYear();
loadCV();
activateRevealEffects();
