/* =========================================================
   S R Ramkishore — Portfolio
   Part B: DOM rendering, event handling, regex validation,
   localStorage persistence. Vanilla ES6+, no libraries.
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. DATA — projects and skills live here as arrays of
   objects. Every card in the Projects section is rendered
   from this array; nothing is hardcoded in the HTML.
   --------------------------------------------------------- */

const projects = [
  {
    id: 'mmcbie',
    title: 'MMCBIE-PRO',
    subtitle: 'Hyperchaotic image encryption',
    image: 'images/project-encryption.svg',
    blurb:
      'Browser-based image encryption built on a 4D Lorenz hyperchaotic map, Arnold Cat Map scrambling and DNA encoding, keyed by SHA-512.',
    detail:
      'Images are diffused with a keystream generated from a four-dimensional Lorenz system, then confused through repeated Arnold Cat Map iterations and encoded using DNA base rules. A 512-bit SHA-512 digest of the source image seeds the initial conditions, so a single changed pixel produces a completely different ciphertext. The goal is defensive: an encrypted portrait carries no facial structure for a deepfake or morphing model to latch onto. Everything runs client-side through the Web Crypto API — the image never leaves the browser.',
    tech: ['JavaScript', 'HTML5', 'Web Crypto API', 'Cryptography'],
    repo: 'https://github.com/ramkishore2110'
  },
  {
    id: 'mindcare',
    title: 'AI Mental Health Support',
    subtitle: 'Emotion-aware chatbot for students',
    image: 'images/project-ai.svg',
    blurb:
      'A Flask chatbot that reads emotional tone in a student\u2019s message and responds with grounded, personalised coping strategies.',
    detail:
      'Built for college students who will talk to a screen long before they book a counsellor. A Flask backend routes each message through the Gemini API with a carefully constrained system prompt, classifies the emotional register, and returns stress and anxiety support tuned to that register rather than generic advice. Conversation state is kept per session, and the interface deliberately stays plain so it feels closer to a notes app than a therapy product.',
    tech: ['Python', 'Flask', 'Gemini API', 'JavaScript'],
    repo: 'https://github.com/ramkishore2110'
  },
  {
    id: 'jail',
    title: 'Jail Management System',
    subtitle: 'Normalised records database',
    image: 'images/project-db.svg',
    blurb:
      'A relational system for prisoner records, staff rosters, visitor logs and cell allocation, with parameterised SQL throughout.',
    detail:
      'A full DBMS project covering schema design, normalisation to third normal form, and referential integrity across prisoners, staff, visitors, sentences and cell blocks. Cell allocation is enforced at the database level with constraints rather than in application code, visitor entries are logged against both prisoner and approving officer, and every query is parameterised so no user input ever reaches the query string directly.',
    tech: ['MySQL', 'SQL', 'DBMS'],
    repo: 'https://github.com/ramkishore2110'
  },
  {
    id: 'solar',
    title: 'Rotating Solar Panel',
    subtitle: 'Sensor-driven sun tracking',
    image: 'images/project-embedded.svg',
    blurb:
      'An embedded auto-tracking panel that reads light intensity from paired LDRs and rotates to hold peak output through the day.',
    detail:
      'Paired light-dependent resistors sit on either side of the panel; the microcontroller compares their readings and drives a servo until the differential falls inside a dead band, which stops the panel hunting back and forth in patchy cloud. The panel parks at a dawn-facing position overnight and resumes tracking at first light. Measured against a fixed-tilt panel over the same day, the tracking version held usable output noticeably longer through the morning and evening.',
    tech: ['Embedded Systems', 'C', 'Sensors'],
    repo: 'https://github.com/ramkishore2110'
  }
];

const skills = [
  { name: 'Python', level: 'Advanced', value: 90 },
  { name: 'SQL & MySQL', level: 'Advanced', value: 85 },
  { name: 'Cybersecurity tooling', level: 'Intermediate', value: 80 },
  { name: 'Java', level: 'Intermediate', value: 72 },
  { name: 'C', level: 'Intermediate', value: 70 },
  { name: 'HTML, CSS & JavaScript', level: 'Intermediate', value: 75 }
];

/* localStorage keys, kept in one place */
const STORE = { theme: 'srr.theme', saved: 'srr.savedProjects' };

/* ---------------------------------------------------------
   2. THEME — persisted across refreshes with localStorage
   --------------------------------------------------------- */

const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
  themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
};

// Restore the saved choice, else follow the operating system.
// The design is black-first, so dark wins unless the visitor chose otherwise.
const storedTheme = localStorage.getItem(STORE.theme);
applyTheme(storedTheme === 'light' ? 'light' : 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORE.theme, next);
});

/* ---------------------------------------------------------
   3. SAVED PROJECTS — a second persisted value: the list of
   projects the visitor starred.
   --------------------------------------------------------- */

const readSaved = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE.saved));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return []; // corrupted value — start clean rather than crash
  }
};

let savedIds = readSaved();
const savedNote = document.getElementById('savedNote');

const writeSaved = () => {
  localStorage.setItem(STORE.saved, JSON.stringify(savedIds));
  renderSavedNote();
};

const renderSavedNote = () => {
  if (!savedIds.length) {
    savedNote.textContent = 'Star a project to keep it pinned on your next visit.';
    return;
  }
  const names = projects.filter(({ id }) => savedIds.includes(id)).map(({ title }) => title);
  savedNote.textContent = `Saved: ${names.join(' · ')}`;
};

/* ---------------------------------------------------------
   4. SKILLS — description list rendered from the array
   --------------------------------------------------------- */

const renderSkills = () => {
  const list = document.getElementById('proficiencyList');
  list.innerHTML = skills
    .map(
      ({ name, level, value }, i) => `
      <dt>${name} <span>${level}</span></dt>
      <dd><div class="meter"><i data-fill="${value}" style="--i:${i}"></i></div></dd>`
    )
    .join('');
};

/* ---------------------------------------------------------
   5. PROJECTS — filter chips + data-driven card rendering
   --------------------------------------------------------- */

const grid = document.getElementById('projectGrid');
const filterBox = document.getElementById('filters');
let activeFilter = 'All';

// Unique technology list, built from the data with a Set + spread.
const technologies = ['All', ...new Set(projects.flatMap(({ tech }) => tech))];

const renderFilters = () => {
  filterBox.innerHTML = technologies
    .map(
      (tech) =>
        `<button class="chip" type="button" data-tech="${tech}" aria-pressed="${tech === activeFilter}">${tech}</button>`
    )
    .join('');
};

const cardMarkup = ({ id, title, subtitle, image, blurb, tech, repo }, i) => {
  const starred = savedIds.includes(id);
  return `
    <article class="card reveal" data-id="${id}" style="--i:${i}">
      <div class="card-thumb">
        <img src="${image}" alt="${title} — ${subtitle}" loading="lazy" />
        <button class="fav" type="button" data-fav="${id}"
                aria-pressed="${starred}" aria-label="Save ${title}">${starred ? '&#9733;' : '&#9734;'}</button>
      </div>
      <div class="card-body">
        <h3>${title}</h3>
        <p class="card-sub">${subtitle}</p>
        <p>${blurb}</p>
        <ul class="tags">${tech.map((t) => `<li>${t}</li>`).join('')}</ul>
        <div class="card-links">
          <button type="button" data-open="${id}">Read more</button>
          <a href="${repo}" target="_blank" rel="noopener">Repository &#8599;</a>
        </div>
      </div>
    </article>`;
};

const renderProjects = () => {
  const visible = projects.filter(
    ({ tech }) => activeFilter === 'All' || tech.includes(activeFilter)
  );

  grid.innerHTML = visible.length
    ? visible.map(cardMarkup).join('')
    : `<p class="empty">Nothing built with ${activeFilter} yet.</p>`;

  // Newly injected cards need to be handed to the scroll observer.
  if (typeof observeReveals === 'function') observeReveals(grid.querySelectorAll('.reveal'));
};

// One delegated listener covers filtering, starring and opening.
filterBox.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  activeFilter = chip.dataset.tech;
  renderFilters();
  renderProjects();
});

grid.addEventListener('click', (event) => {
  const favBtn = event.target.closest('[data-fav]');
  if (favBtn) {
    const { fav } = favBtn.dataset;
    savedIds = savedIds.includes(fav) ? savedIds.filter((x) => x !== fav) : [...savedIds, fav];
    writeSaved();
    renderProjects();

    // Re-find the button after the re-render and give it a spring.
    const fresh = grid.querySelector(`[data-fav="${fav}"]`);
    if (fresh) {
      fresh.classList.add('pop');
      fresh.addEventListener('animationend', () => fresh.classList.remove('pop'), { once: true });
    }
    return;
  }

  const openBtn = event.target.closest('[data-open]');
  if (openBtn) openModal(openBtn.dataset.open);
});

/* ---------------------------------------------------------
   6. MODAL — project detail
   --------------------------------------------------------- */

const modal = document.getElementById('modal');
const modalCard = document.getElementById('modalCard');

function openModal(id) {
  const project = projects.find((p) => p.id === id);
  if (!project) return;

  const { title, subtitle, detail, tech, repo } = project;
  modalCard.innerHTML = `
    <h3 id="modalTitle">${title}</h3>
    <p class="modal-role">${subtitle}</p>
    <p>${detail}</p>
    <ul class="tags">${tech.map((t) => `<li>${t}</li>`).join('')}</ul>
    <a class="btn btn-line" href="${repo}" target="_blank" rel="noopener">View repository</a>
    <button class="btn btn-solid modal-close" type="button" id="modalClose">Close</button>`;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
};

modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target.id === 'modalClose') closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

/* ---------------------------------------------------------
   7. NAVIGATION — hamburger toggle + scroll-to-top
   --------------------------------------------------------- */

const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

navToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close the mobile menu after a jump.
navList.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Visibility of this button is handled in the motion module (§9a),
// which batches every scroll-driven update into a single frame.
const toTop = document.getElementById('toTop');
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------------------------------------------------------
   8. CONTACT FORM — regex validation, no page reload
   --------------------------------------------------------- */

const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Each rule: the pattern to satisfy and the message shown when it fails.
const rules = {
  name: {
    pattern: /^[A-Za-z][A-Za-z\s.'-]{1,49}$/,
    error: 'Letters, spaces, hyphens and apostrophes only — at least 2 characters.'
  },
  email: {
    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
    error: 'That address is missing something — try name@example.com.'
  },
  message: {
    pattern: /^[\s\S]{10,1000}$/,
    error: 'Give me at least 10 characters to work with.'
  }
};

const validateField = (field) => {
  const input = document.getElementById(field);
  const msg = document.getElementById(`${field}Msg`);
  const { pattern, error } = rules[field];
  const ok = pattern.test(input.value.trim());

  input.classList.toggle('invalid', !ok);
  input.classList.toggle('valid', ok);
  msg.textContent = ok ? 'Looks good.' : error;
  msg.className = ok ? 'msg ok' : 'msg error';
  return ok;
};

// Validate as the visitor types, but only after the first attempt at that field.
Object.keys(rules).forEach((field) => {
  const input = document.getElementById(field);
  input.addEventListener('blur', () => validateField(field));
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid') || input.classList.contains('valid')) {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault(); // never reload the page

  const results = Object.keys(rules).map(validateField);
  const allValid = results.every(Boolean);

  if (!allValid) {
    formStatus.textContent = 'Fix the highlighted fields and send again.';
    formStatus.style.color = 'var(--pink)';
    return;
  }

  const { name } = Object.fromEntries(new FormData(form));
  formStatus.textContent = `Thanks, ${name.trim()} — message queued. I'll reply to you by email.`;
  formStatus.style.color = 'var(--blue)';

  form.reset();
  Object.keys(rules).forEach((field) => {
    document.getElementById(field).classList.remove('valid', 'invalid');
    document.getElementById(`${field}Msg`).textContent = '';
  });
});

/* ---------------------------------------------------------
    9. MOTION — scroll progress, entrances, nav tracking,
   ticker. All of it checks prefers-reduced-motion first.
   --------------------------------------------------------- */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 9a. Scroll progress line + header shrink, batched into one
   rAF so the scroll handler never does layout work directly. */
const progress = document.getElementById('progress');
const siteHeader = document.getElementById('siteHeader');
let ticking = false;

const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${pct}%`;
  siteHeader.classList.toggle('shrunk', window.scrollY > 60);
  toTop.classList.toggle('show', window.scrollY > 500);
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(onScroll);
}, { passive: true });

/* 9b. Scroll entrances. One shared observer; elements drop
   their reveal classes once they have arrived so hover
   transforms on cards are not fighting the entrance. */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('in');
      revealObserver.unobserve(target);

      if (target.classList.contains('card')) {
        target.addEventListener(
          'transitionend',
          () => target.classList.remove('reveal', 'in'),
          { once: true }
        );
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
);

function observeReveals(nodes) {
  nodes.forEach((node) => revealObserver.observe(node));
}

/* Tag up everything worth animating, with a stagger index per group. */
const markReveals = () => {
  const groups = [
    '.section-tag',
    '.section-head',
    '.prose p',
    '.facts',
    '.skill-block',
    '.tool-list li',
    '.path li',
    '.table-wrap',
    '.contact-list li',
    '.contact-form',
    '.foot-name'
  ];

  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', i % 8);
    });
  });

  observeReveals(document.querySelectorAll('.reveal'));
};

/* 9c. Skill meters fill only once they are on screen. */
const meterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.style.width = `${target.dataset.fill}%`;
      meterObserver.unobserve(target);
    });
  },
  { threshold: 0.4 }
);

const animateMeters = () => {
  document.querySelectorAll('.meter i').forEach((bar) => {
    if (reducedMotion) {
      bar.style.width = `${bar.dataset.fill}%`;
    } else {
      meterObserver.observe(bar);
    }
  });
};

/* 9d. Nav highlights whichever section you are reading. */
const trackSections = () => {
  const links = [...document.querySelectorAll('.nav-list a')];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle('active', link.getAttribute('href') === `#${target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sectionObserver.observe(section);
  });
};

/* 9e. Ticker band. The list is duplicated so the -50%
   translate loops without a visible seam. */
const buildTicker = () => {
  const phrases = [
    'Chaotic-map cryptography',
    'Secure code characterization',
    'Agentic AI workflows',
    'Network forensics',
    'DRDO \u00B7 IBM \u00B7 ICT Academy',
    'Available 2027'
  ];

  document.getElementById('tickerTrack').innerHTML = [...phrases, ...phrases]
    .map((text) => `<span class="ticker-item">${text}</span>`)
    .join('');
};

/* ---------------------------------------------------------
   10. BOOT
   --------------------------------------------------------- */

document.getElementById('year').textContent = new Date().getFullYear();
renderSkills();
renderFilters();
renderProjects();
renderSavedNote();
buildTicker();
markReveals();
animateMeters();
trackSections();
onScroll();
