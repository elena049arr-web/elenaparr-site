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

/* ---------- Hero hand-lettering ----------
   Plays erase clip, then the "Nice to meet ya" write clip, then hands off
   to the matching final still so it holds crisply afterward (rather than
   lingering on a paused video frame).
   Falls back to the final still directly for reduced-motion / no-js users. */
const heroClipErase = document.getElementById('heroClipErase');
const heroClip = document.getElementById('heroClip');
const heroClipFinal = document.getElementById('heroClipFinal');
if (heroClipErase && heroClip && heroClipFinal) {
  if (prefersReducedMotion) {
    heroClipErase.classList.add('is-hidden');
    heroClip.classList.add('is-hidden');
    heroClipFinal.classList.add('is-visible');
    revealHeroWriting();  // greeting just shows (CSS neutralizes the pop here)
    revealHeroTagline();  // tagline shows immediately, no stagger
  } else {
    const TAGLINE_AFTER_GREETING_MS = 500; // tagline follows the greeting pop
    const GREETING_HOLD_MS = 3500;         // hold on "Hi, I'm Elena", then erase

    // Reveal the greeting + tagline immediately and UNCONDITIONALLY. This must
    // never wait on the video: preload is only a hint, and some browsers don't
    // load the clip until play() is called — which would leave the whole hero
    // stuck invisible (both the greeting and the tagline). The video is an
    // independent layer underneath and reveals nothing on its own.
    revealHeroWriting();
    setTimeout(revealHeroTagline, TAGLINE_AFTER_GREETING_MS);

    heroClipErase.currentTime = 0;
    // Hold on the greeting for a beat, then play (which also loads) the erase
    // clip. It plays from the SAME element that popped in, so no swap/seam.
    setTimeout(() => {
      heroClipErase.play().catch(() => {});
    }, GREETING_HOLD_MS);

    heroClipErase.addEventListener('ended', () => {
      heroClipErase.classList.add('is-hidden');
      heroClip.classList.remove('is-hidden');
      heroClip.currentTime = 0;
      heroClip.playbackRate = 1.1; // sped up 10% per feedback
      heroClip.play().catch(() => {});
    });
    // The "Nice to meet ya" clip simply pauses on its last frame and stays
    // there — no swap to a separate still (that reintroduced a visible seam).
    // Nothing is gated on 'ended' anymore: the tagline was revealed up front.
  }
} else {
  revealHeroWriting();
  revealHeroTagline(); // no hero video elements present at all — just reveal
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

/* ---------- Fine art: film-reel belt ----------
   The reel frame (top/bottom sprocket strips) is pure CSS/background-image —
   it never moves. This duplicates the artwork sequence once so a -50%
   translateX loops seamlessly, per spec. Motion itself is scroll-linked
   (see below) rather than autoplaying on a timer, to match the same
   "responds to you" language as the wheel and ambient light. */
(function setupFilmReel() {
  const track = document.getElementById('filmReelTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML; // exactly one duplicate = seamless -50% loop

  if (prefersReducedMotion) return; // falls back to a plain, manually-scrollable strip (see CSS)

  const SPEED = 0.04; // % of the loop advanced per pixel scrolled — tuned to feel continuous, not frantic
  let ticking = false;
  function positionTrack() {
    const pct = (window.scrollY * SPEED) % 50; // track holds two copies, so -50% is the seamless loop point
    track.style.transform = `translateX(-${pct}%)`;
    ticking = false;
  }
  positionTrack();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(positionTrack);
      ticking = true;
    }
  }, { passive: true });
})();

/* ---------- Branding: duplicate swatch columns for seamless loop ---------- */
['swatchTrack1', 'swatchTrack2'].forEach((id) => {
  const track = document.getElementById(id);
  if (track) track.innerHTML += track.innerHTML;
});

/* ---------- Fine art: semicircular art wheel (Personal Studio) ----------
   Scroll-driven: the belt shifts as the visitor scrolls past the section,
   rather than auto-playing on a timer. Pieces sit closer together (tighter
   angular step than one-per-slot) so it reads as a continuous belt. */
(function setupArtWheel() {
  const stage = document.getElementById('artWheel');
  const track = document.getElementById('artWheelTrack');
  if (!stage || !track) return;
  track.innerHTML += track.innerHTML; // duplicate once: lets tight spacing wrap the full circle with no gaps
  const pieces = Array.from(track.querySelectorAll('.art-wheel-piece'));
  const count = pieces.length;
  if (!count) return;

  const ANGLE_SPAN = 130;
  const ANGLE_STEP = 26; // tight, matches the original spacing — safe now that pieces repeat around the full circle
  let offset = 0;

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const centerX = w / 2;
    const centerY = h * 0.44;
    const RADIUS = w * 0.46;
    const half = ANGLE_SPAN / 2;

    pieces.forEach((piece, i) => {
      let angle = (i * ANGLE_STEP + offset) % 360;
      if (angle > 180) angle -= 360;

      const visible = Math.abs(angle) <= half + ANGLE_STEP;
      if (!visible) {
        piece.style.opacity = '0';
        piece.style.pointerEvents = 'none';
        return;
      }

      const rad = (angle * Math.PI) / 180;
      const x = centerX + RADIUS * Math.sin(rad);
      const y = centerY + RADIUS * 0.21 * (1 - Math.cos(rad)); // gentle downward curve, not a huge drop

      const distFromCenter = Math.min(Math.abs(angle) / half, 1);
      const scale = 1.1 - distFromCenter * 0.3;
      const fade = 1 - Math.max(0, (Math.abs(angle) - half * 0.7) / (half * 0.3));

      piece.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle * 0.15}deg) scale(${scale})`;
      piece.style.opacity = String(Math.max(0.2, Math.min(1, fade)));
      piece.style.zIndex = String(1000 - Math.round(Math.abs(angle) * 10));
      piece.style.pointerEvents = 'auto';
    });
  }

  layout();
  window.addEventListener('resize', layout);

  if (!prefersReducedMotion) {
    // Horizontal-scroll-linked: offset derives from actual horizontal scroll
    // input over the wheel (trackpad two-finger horizontal swipe, or
    // shift+mouse-wheel) — not from the page's vertical scroll position.
    let ticking = false;
    let pendingDelta = 0;
    stage.addEventListener('wheel', (e) => {
      // only hijack when the gesture is meaningfully horizontal, so normal
      // vertical page-scrolling over this section still works untouched
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        pendingDelta += e.deltaX;
        if (!ticking) {
          requestAnimationFrame(() => {
            offset = (offset + pendingDelta * 0.25) % 360;
            pendingDelta = 0;
            layout();
            ticking = false;
          });
          ticking = true;
        }
      }
    }, { passive: false });
  }
})();

/* ---------- Brainbow reveal: play once, freeze, then smoothly crossfade to the static logo ---------- */
(function setupBrainbowReveal() {
  const clip = document.getElementById('brainbowClip');
  const final = document.getElementById('brainbowFinal');
  if (!clip || !final) return;

  if (prefersReducedMotion) {
    clip.classList.add('is-hidden');
    final.classList.add('is-visible');
    return;
  }

  clip.currentTime = 0;
  clip.play().catch(() => {});
  clip.addEventListener('ended', () => {
    // hold on the frozen last frame briefly before the slow crossfade begins
    setTimeout(() => {
      final.classList.add('is-visible');
      // only hide the video once the long crossfade has fully finished
      setTimeout(() => clip.classList.add('is-hidden'), 1150);
    }, 400);
  });
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

/* ---------- The Archive: interactive crossword + achievement system ---------- */
(function setupCrossword() {
  const puzzleEl = document.getElementById('crosswordPuzzle');
  if (!puzzleEl) return;

  // Word list — verified to interlock correctly (row/col are 0-indexed, dir 'A'=across, 'D'=down)
  const WORDS = [
    { num: 1, dir: 'D', row: 0, col: 2, answer: 'FOUNDER',
      clue: 'Someone who pioneers a new expedition in business.',
      achievement: {
        title: 'Founder',
        body: "Co-founded Brainbow, a student venture that reached the finals of the CREATE competition.",
        image: 'assets/images/brainbow-logo.webp'
      } },
    { num: 2, dir: 'A', row: 1, col: 1, answer: 'BOOK',
      clue: 'Has a spine, pages, and an Author usually.',
      achievement: {
        title: 'Published Children\u2019s Book',
        body: 'Illustrated two published children\u2019s books — "My Story About Pans/Pandas" by Owen Ross, and "Ivory Butterflies" by Campbell Colby.',
        image: 'assets/images/pub-ivory-butterflies.webp'
      } },
    { num: 3, dir: 'D', row: 0, col: 5, answer: 'PITCH',
      clue: 'A short way to hook someone on a business idea.',
      achievement: {
        title: 'Top 10 University Pitch Competition',
        body: 'Named among the top ten teams in a university pitch competition.',
        image: null
      } },
    { num: 4, dir: 'A', row: 3, col: 0, answer: 'NONFICTION',
      clue: 'The genre opposite to fiction.',
      achievement: {
        title: 'Maine Nonfiction Award',
        body: 'Recipient of a Maine Nonfiction Award.',
        image: null
      } },
    { num: 5, dir: 'D', row: 3, col: 6, answer: 'TEACHERS',
      clue: 'Schools employ\u2026',
      achievement: {
        title: 'Educational Design Experience',
        body: 'Illustrated "Listening and Learning at School" (written by Jacqui Chait) and a "Stop, Look, Listen" social-emotional learning story — design work made for real classrooms.',
        image: 'assets/images/edu-stop-look-listen.webp'
      } },
    { num: 7, dir: 'A', row: 5, col: 6, answer: 'AI',
      clue: 'Acronym for a new type of conscious intelligence with no regulation.',
      achievement: {
        title: 'AI Competition Presentation',
        body: 'Presented at an AI competition.',
        image: null
      } },
    { num: 6, dir: 'A', row: 7, col: 0, answer: 'ALIVE',
      clue: 'Not Dead but\u2026',
      achievement: {
        title: 'Arrive Alive Contest',
        body: 'Created a piece for the Arrive Alive contest.',
        image: null
      } },
    { num: 6, dir: 'D', row: 7, col: 0, answer: 'ART',
      clue: 'A way of expression through color, shape, and design.',
      achievement: {
        title: 'Artwork Gallery',
        body: 'A studio practice spanning charcoal figure studies, ink comics, and vivid painterly work — the foundation underneath everything else in this portfolio.',
        image: 'assets/images/fineart-01-fairy.webp'
      } },
  ];

  // --- build cell map ---
  const cells = {}; // "r,c" -> { letter, numbers:[], wordsAcross:[wordIdx], wordsDown:[wordIdx] }
  WORDS.forEach((w, idx) => {
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'A' ? w.row : w.row + i;
      const c = w.dir === 'A' ? w.col + i : w.col;
      const key = `${r},${c}`;
      if (!cells[key]) cells[key] = { letter: w.answer[i], r, c, wordIdx: {} };
      cells[key].wordIdx[w.dir] = idx;
      if (i === 0) {
        cells[key].num = w.num;
      }
    }
  });

  const rows = Math.max(...Object.values(cells).map(c => c.r)) + 1;
  const cols = Math.max(...Object.values(cells).map(c => c.c)) + 1;

  puzzleEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  puzzleEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  puzzleEl.setAttribute('style', puzzleEl.getAttribute('style') + `aspect-ratio:${cols}/${rows};`);

  const inputRefs = {}; // "r,c" -> input element

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      const cellData = cells[key];
      const cellEl = document.createElement('div');
      cellEl.className = 'cwx-cell';
      if (!cellData) {
        cellEl.classList.add('cwx-blank');
        puzzleEl.appendChild(cellEl);
        continue;
      }
      if (cellData.num) {
        const numEl = document.createElement('span');
        numEl.className = 'cwx-num';
        numEl.textContent = cellData.num;
        cellEl.appendChild(numEl);
      }
      const input = document.createElement('input');
      input.className = 'cwx-input';
      input.maxLength = 1;
      input.setAttribute('inputmode', 'text');
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}`);
      input.dataset.r = r;
      input.dataset.c = c;
      cellEl.appendChild(input);
      puzzleEl.appendChild(cellEl);
      inputRefs[key] = input;
      cellData.el = cellEl;
      cellData.input = input;
    }
  }

  // --- direction tracking per cell (a cell can belong to both an across and down word) ---
  let activeDir = 'A';

  function wordCellsFor(wordIdx) {
    const w = WORDS[wordIdx];
    const out = [];
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'A' ? w.row : w.row + i;
      const c = w.dir === 'A' ? w.col + i : w.col;
      out.push(cells[`${r},${c}`]);
    }
    return out;
  }

  function highlightWord(wordIdx) {
    document.querySelectorAll('.cwx-cell.is-active-word').forEach(el => el.classList.remove('is-active-word'));
    if (wordIdx == null) return;
    wordCellsFor(wordIdx).forEach(cd => cd.el.classList.add('is-active-word'));
  }

  function currentWordIdx(cellData) {
    if (cellData.wordIdx[activeDir] != null) return cellData.wordIdx[activeDir];
    // fall back to whichever direction exists
    if (cellData.wordIdx.A != null) { activeDir = 'A'; return cellData.wordIdx.A; }
    if (cellData.wordIdx.D != null) { activeDir = 'D'; return cellData.wordIdx.D; }
    return null;
  }

  const completedWords = new Set();

  function checkWord(wordIdx) {
    if (wordIdx == null || completedWords.has(wordIdx)) return;
    const w = WORDS[wordIdx];
    const wCells = wordCellsFor(wordIdx);
    const typed = wCells.map(cd => (cd.input.value || '').toUpperCase()).join('');
    if (typed === w.answer) {
      completedWords.add(wordIdx);
      const clueLi = document.querySelector(`[data-word-key="${w.dir}-${w.num}"]`);
      // Celebrate first: staggered pulse across the word's cells, then mark solved, then reveal the story.
      wCells.forEach((cd, i) => {
        setTimeout(() => {
          cd.input.classList.add('is-celebrating');
          cd.input.addEventListener('animationend', () => {
            cd.el.classList.add('is-correct');
            cd.input.disabled = true;
          }, { once: true });
        }, i * 70);
      });
      const totalCelebrateTime = wCells.length * 70 + 550;
      setTimeout(() => {
        if (clueLi) clueLi.classList.add('is-solved');
        openAchievement(w.achievement);
      }, totalCelebrateTime + 250);
    }
  }

  Object.values(cells).forEach(cellData => {
    const input = cellData.input;
    input.addEventListener('focus', () => {
      const wIdx = currentWordIdx(cellData);
      highlightWord(wIdx);
    });
    input.addEventListener('click', () => {
      // toggle direction if this cell belongs to both an across and down word
      if (cellData.wordIdx.A != null && cellData.wordIdx.D != null) {
        activeDir = activeDir === 'A' ? 'D' : 'A';
      }
      highlightWord(currentWordIdx(cellData));
    });
    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
      const wIdx = currentWordIdx(cellData);
      checkWord(wIdx);
      // advance to next cell in this word
      if (wIdx != null && input.value) {
        const w = WORDS[wIdx];
        const idxInWord = w.dir === 'A' ? (cellData.c - w.col) : (cellData.r - w.row);
        const nextR = w.dir === 'A' ? cellData.r : cellData.r + 1;
        const nextC = w.dir === 'A' ? cellData.c + 1 : cellData.c;
        const nextCell = cells[`${nextR},${nextC}`];
        if (nextCell && idxInWord < w.answer.length - 1) nextCell.input.focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value) {
        const wIdx = currentWordIdx(cellData);
        if (wIdx != null) {
          const w = WORDS[wIdx];
          const prevR = w.dir === 'A' ? cellData.r : cellData.r - 1;
          const prevC = w.dir === 'A' ? cellData.c - 1 : cellData.c;
          const prevCell = cells[`${prevR},${prevC}`];
          if (prevCell) prevCell.input.focus();
        }
      }
    });
  });

  // --- render clue lists ---
  const acrossList = document.getElementById('cluesAcross');
  const downList = document.getElementById('cluesDown');
  WORDS.filter(w => w.dir === 'A').sort((a, b) => a.num - b.num).forEach(w => {
    const li = document.createElement('li');
    li.dataset.wordKey = `A-${w.num}`;
    li.innerHTML = `<strong>${w.num}.</strong> ${w.clue}`;
    acrossList.appendChild(li);
  });
  WORDS.filter(w => w.dir === 'D').sort((a, b) => a.num - b.num).forEach(w => {
    const li = document.createElement('li');
    li.dataset.wordKey = `D-${w.num}`;
    li.innerHTML = `<strong>${w.num}.</strong> ${w.clue}`;
    downList.appendChild(li);
  });

  // --- achievement overlay ---
  const overlay = document.getElementById('achievementOverlay');
  const panelTitle = document.getElementById('achievementTitle');
  const panelBody = document.getElementById('achievementBody');
  const panelImage = document.getElementById('achievementImage');
  const closeBtn = document.getElementById('achievementClose');
  let lastFocusedCell = null;

  function openAchievement(ach) {
    lastFocusedCell = document.activeElement;
    panelTitle.textContent = ach.title;
    panelBody.textContent = ach.body;
    panelImage.innerHTML = ach.image ? `<img src="${ach.image}" alt="">` : '';
    overlay.style.top = `${window.scrollY}px`; // align with the current viewport — see CSS comment for why this isn't just position:fixed
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus({ preventScroll: true }); // don't let focusing this auto-scroll the page
  }
  function closeAchievement() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocusedCell) lastFocusedCell.focus({ preventScroll: true });
  }
  closeBtn.addEventListener('click', closeAchievement);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAchievement(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeAchievement();
  });
})();

/* ---------- Contact form (no backend wired yet) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Interim, no-backend behavior: compose an email from the field values via
  // the visitor's own mail client. Swap in Formspree/EmailJS later without
  // touching the markup. Uses hello@elenaparr.com — update if that changes.
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#cf-name').value.trim();
    const email = contactForm.querySelector('#cf-email').value.trim();
    const message = contactForm.querySelector('#cf-message').value.trim();
    const subject = `Portfolio inquiry${name ? ' from ' + name : ''}`;
    const body = `From: ${email}\n\n${message}`;
    window.location.href =
      `mailto:hello@elenaparr.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* ---------- Ambient rainbow-light reflection ----------
   Fades in via IntersectionObserver once the visitor scrolls into Fine
   Art (and stays through the rest of the page, restrained), nudges
   slightly warmer while the colorful Personal Studio wheel is in view,
   then settles back down. A slow scroll-linked parallax (~15% of scroll
   speed) is layered on top of the fixed base position for subtle drift.
   Fully static (no animation, no parallax) under reduced motion. */
(function setupAmbientLight() {
  const layer = document.getElementById('ambientLight');
  const fineArtSection = document.getElementById('fine-art');
  const wheelStage = document.getElementById('artWheel');
  if (!layer || !fineArtSection) return;

  const visibleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Once the visitor has scrolled past the top of Fine Art, the light
      // stays on (restrained) for the remainder of the page — it only
      // switches off again if they scroll back up above it.
      const pastTopOfFineArt = entry.boundingClientRect.top < 0 || entry.isIntersecting;
      layer.classList.toggle('is-visible', pastTopOfFineArt);
    });
  }, { threshold: 0, rootMargin: '0px 0px -60% 0px' });
  visibleObserver.observe(fineArtSection);

  if (wheelStage) {
    const vividObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        layer.classList.toggle('is-vivid', entry.isIntersecting);
      });
    }, { threshold: 0.2 });
    vividObserver.observe(wheelStage);
  }

  // Not position:fixed (see CSS comment for why) — so this keeps the layer
  // manually aligned with the current scroll position every frame, then
  // layers a small parallax offset on top when motion is allowed. The
  // offset is measured from Fine Art's own position, not the absolute
  // page scroll — otherwise 15% of a huge scrollY (since Fine Art sits
  // well below Hero + Publications) is already hundreds of px before the
  // light is even visible.
  let ticking = false;
  function positionLayer() {
    const scrollPastFineArt = Math.max(0, window.scrollY - fineArtSection.offsetTop);
    const parallaxOffset = prefersReducedMotion ? 0 : scrollPastFineArt * 0.15;
    layer.style.top = `${window.scrollY - parallaxOffset}px`;
    ticking = false;
  }
  positionLayer();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(positionLayer);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', positionLayer);
})();

/* ---------- Hero tagline: word-by-word pop-in reveal ----------
   Splits the intro sentence into individual words (each wrapped in its
   own span) immediately, but doesn't actually trigger the reveal until
   revealHeroTagline() is called — which happens once the hero name
   sequence's 'ended' event fires (see above), not on page load. That
   way the secondary tagline text follows "Hi, I'm Elena... Nice to meet
   ya" instead of finishing its own reveal before the greeting even
   starts. Inspired by the word-pop intro on spencergabor.work. The
   linked "Stellina Mae" text is kept intact as its own single reveal
   unit rather than split further, so the link stays clickable. */
const STAGGER_MS = 90; // slower, more editorial cadence per feedback (was 45)

function wrapHeroTaglineWords() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;

  let wordIndex = 0;
  const originalChildren = Array.from(el.childNodes);
  el.textContent = ''; // clear, then rebuild with wrapped words

  originalChildren.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // split on whitespace but keep the whitespace itself so word
      // spacing in the sentence is preserved exactly
      const parts = node.textContent.split(/(\s+)/);
      parts.forEach((part) => {
        if (part === '') return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.style.transitionDelay = `${wordIndex * STAGGER_MS}ms`;
          span.textContent = part;
          el.appendChild(span);
          wordIndex += 1;
        }
      });
    } else {
      // e.g. the <a href="#stellina">Stellina Mae</a> link — kept as one
      // whole reveal unit so it doesn't fragment or lose its click target
      node.classList.add('reveal-word');
      node.style.transitionDelay = `${wordIndex * STAGGER_MS}ms`;
      el.appendChild(node);
      wordIndex += 1;
    }
  });
}
wrapHeroTaglineWords();

function revealHeroWriting() {
  // Pops the greeting block ("Hi, I'm Elena") in as one unit on load. Uses
  // the same double-rAF guard as the tagline so the browser paints the
  // hidden state once before the transition class is added.
  const el = document.getElementById('heroWriting');
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('is-revealed');
    });
  });
}

function revealHeroTagline() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;
  // Double rAF: guarantees the browser has painted the (invisible) words
  // at least once before we add the class that transitions them in —
  // otherwise the transition can get skipped if it fires in the same frame.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('is-revealed');
    });
  });
}
