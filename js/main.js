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

    const experience = document.getElementById('experience-list');
    experience.innerHTML = '';
    (cv.experience ?? []).forEach(job => {
      const card = document.createElement('article');
      card.className = 'timeline-item';

      const skillText = (job.skills ?? []).join(' · ');
      const responsibilities = (job.responsibilities ?? []).length
        ? `<ul class="job-responsibilities">${job.responsibilities.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '';

      card.innerHTML = `
        <div class="timeline-marker" aria-hidden="true"></div>
        <div class="timeline-card">
          <div class="timeline-head">
            <div>
              <h3>${escapeHtml(job.role)}</h3>
              <p class="company">${escapeHtml(job.company)}${job.employment_type ? ' · ' + escapeHtml(job.employment_type) : ''}</p>
            </div>
            ${job.work_mode ? `<span class="work-mode">${escapeHtml(job.work_mode)}</span>` : ''}
          </div>
          <p class="period">${escapeHtml(job.start)} - ${escapeHtml(job.end)}</p>
          ${job.location ? `<p class="location">${escapeHtml(job.location)}</p>` : ''}
          ${responsibilities}
          ${skillText ? `<p class="job-skills">${escapeHtml(skillText)}</p>` : ''}
        </div>
      `;

      experience.appendChild(card);
    });

    const education = document.getElementById('education-list');
    education.innerHTML = '';
    (cv.education ?? []).forEach(item => {
      const card = document.createElement('article');
      card.className = 'timeline-item';
      card.innerHTML = `
        <div class="timeline-marker" aria-hidden="true"></div>
        <div class="timeline-card">
          <h3>${escapeHtml(item.level)}</h3>
          <p class="company">${escapeHtml(item.institution)}</p>
          <p class="period">${escapeHtml(item.start)}${item.end ? ' - ' + escapeHtml(item.end) : ''}</p>
        </div>
      `;
      education.appendChild(card);
    });

    const extras = document.getElementById('extras-list');
    extras.innerHTML = '';
    [...(cv.soft_skills ?? []), ...(cv.languages ?? []).map(x => `${x.language}: ${x.level}`)].forEach(text => {
      const item = document.createElement('span');
      item.className = 'chip';
      item.textContent = text;
      extras.appendChild(item);
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
