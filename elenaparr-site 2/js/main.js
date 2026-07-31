document.documentElement.classList.remove('no-js');
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion');
}

/* ---------- Header scroll state ---------- */
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
primaryNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Hero hand-lettering sequence ----------
   Plays the 6 clips in order, once, on load.
   Falls back to static text for reduced-motion / no-js users. */
if (!prefersReducedMotion) {
  const clips = Array.from(document.querySelectorAll('.hero-clip'));
  if (clips.length) {
    let i = 0;
    const playNext = () => {
      clips.forEach(c => c.classList.remove('is-active'));
      if (i >= clips.length) return;
      const clip = clips[i];
      clip.classList.add('is-active');
      clip.currentTime = 0;
      clip.play().catch(() => {});
      clip.onended = () => {
        i++;
        playNext();
      };
    };
    playNext();
  }
}

/* ---------- Scroll-triggered reveals ---------- */
document.querySelectorAll('.section-inner').forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

/* ---------- Bee ambient float (GSAP) ---------- */
if (window.gsap && !prefersReducedMotion) {
  gsap.to('.bee-a', {
    y: '+=18', x: '+=10', rotation: 6,
    duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
  gsap.to('.bee-b', {
    y: '-=14', x: '-=16', rotation: -8,
    duration: 4.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6
  });
}

/* ---------- Crossword teaser (MVP: simple reveal toggle) ---------- */
const crosswordCard = document.getElementById('crosswordCard');
if (crosswordCard) {
  const activate = () => {
    crosswordCard.setAttribute('aria-pressed', 'true');
    // NOTE: placeholder behavior for MVP launch.
    // Full crossword-gated newspaper reveal (solve-to-unlock) is planned for the next design pass.
    crosswordCard.querySelector('.crossword-teaser-sub').textContent =
      'Full interactive crossword coming soon — check back after launch.';
  };
  crosswordCard.addEventListener('click', activate);
  crosswordCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });
}

/* ---------- Contact form (no backend wired yet) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = contactForm.querySelector('.contact-form-note');
    note.textContent = "Thanks! (Form isn't connected to email yet — that's next.)";
  });
}
