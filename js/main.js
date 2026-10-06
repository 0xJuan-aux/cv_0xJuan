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

    if (!(cv.experience ?? []).length) {
      experience.className = 'timeline empty-state';
      experience.textContent = 'Información en actualización.';
    } else {
      experience.className = 'timeline';

      cv.experience.forEach(job => {
        const card = document.createElement('article');
        card.className = 'timeline-item';

        const skillText = [
          ...(job.skills ?? []),
          job.additional_skills_count
            ? `+${job.additional_skills_count} aptitudes adicionales`
            : null
        ].filter(Boolean).join(' · ');

        card.innerHTML = `
          <div class="timeline-marker" aria-hidden="true"></div>
          <div class="timeline-card">
            <div class="timeline-head">
              <div>
                <h3>${job.role ?? ''}</h3>
                <p class="company">${job.company ?? ''} · ${job.employment_type ?? ''}</p>
              </div>
              <span class="work-mode">${job.work_mode ?? ''}</span>
            </div>
            <p class="period">${job.start ?? ''} - ${job.end ?? ''} · ${job.duration ?? ''}</p>
            <p class="location">${job.location ?? ''}</p>
            ${skillText ? `<p class="job-skills">${skillText}</p>` : ''}
          </div>
        `;

        experience.appendChild(card);
      });
    }
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
