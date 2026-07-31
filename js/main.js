document.documentElement.classList.remove('no-js');
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion');
}

/* ---------- Header logo: parallax entrance tied to hero scroll ----------
   Starts hidden/large, fades and shrinks into its normal header position
   as the visitor scrolls from the hero into Publications. */
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.set('.logo-mark', { opacity: 0, scale: 2.6, transformOrigin: 'left center' });
  gsap.to('.logo-mark', {
    opacity: 1,
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}
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

/* ---------- Fine art: semicircular arc carousel ----------
   Paintings travel along a shallow curved path (not a spinning wheel,
   not a horizontal slider). Center pieces get more scale/depth emphasis.
   Motion is slow, continuous, and pauses on hover/focus. */
(function setupArtArc() {
  const stage = document.querySelector('.art-arc-stage');
  const track = document.getElementById('artArcTrack');
  if (!stage || !track) return;
  const pieces = Array.from(track.querySelectorAll('.art-piece'));
  const count = pieces.length;
  if (!count) return;

  const ANGLE_SPAN = 130; // total degrees of visible arc
  const RADIUS = 900; // large radius = gentle, shallow curve
  let paused = false;
  let offset = 0; // degrees, increases slowly over time
  const stepPerItem = 360 / count;

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const centerX = w / 2;
    const centerY = h + RADIUS - h * 0.42; // arc center sits below the stage

    pieces.forEach((piece, i) => {
      let angle = (i * stepPerItem + offset) % 360;
      if (angle > 180) angle -= 360; // range now -180..180

      // Only render pieces within (and just outside) the visible arc window
      const half = ANGLE_SPAN / 2;
      const visible = Math.abs(angle) <= half + stepPerItem;
      if (!visible) {
        piece.style.opacity = '0';
        piece.style.pointerEvents = 'none';
        return;
      }

      const rad = (angle * Math.PI) / 180;
      const x = centerX + RADIUS * Math.sin(rad);
      const y = centerY - RADIUS * Math.cos(rad);

      const distFromCenter = Math.min(Math.abs(angle) / half, 1);
      const scale = 1.08 - distFromCenter * 0.32;
      const fade = 1 - Math.max(0, (Math.abs(angle) - half * 0.7) / (half * 0.3));

      piece.style.transform =
        `translate(-50%, -50%) translate(${x - centerX}px, ${y - centerY + h * 0.5}px) rotate(${angle * 0.18}deg) scale(${scale})`;
      piece.style.opacity = String(Math.max(0.15, Math.min(1, fade)));
      piece.style.zIndex = String(1000 - Math.round(Math.abs(angle) * 10));
      piece.style.pointerEvents = 'auto';
    });
  }

  layout();
  window.addEventListener('resize', layout);

  stage.addEventListener('mouseenter', () => { paused = true; });
  stage.addEventListener('mouseleave', () => { paused = false; });
  stage.addEventListener('focusin', () => { paused = true; });
  stage.addEventListener('focusout', () => { paused = false; });

  if (!prefersReducedMotion) {
    const SPEED = 3.2; // degrees per second — slow and elegant
    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        offset = (offset + SPEED * dt) % 360;
        layout();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();

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
    const label = crosswordCard.querySelector('.crossword-teaser-label');
    if (label) label.textContent = 'Interactive version coming soon';
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
