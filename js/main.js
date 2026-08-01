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
  } else {
    heroClipErase.currentTime = 0;
    heroClipErase.play().catch(() => {});
    heroClipErase.addEventListener('ended', () => {
      heroClipErase.classList.add('is-hidden');
      heroClip.classList.remove('is-hidden');
      heroClip.currentTime = 0;
      heroClip.play().catch(() => {});
    });
    heroClip.addEventListener('ended', () => {
      heroClip.classList.add('is-hidden');
      heroClipFinal.classList.add('is-visible');
    });
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

/* ---------- Fine art: film-reel belt ----------
   The reel frame (top/bottom sprocket strips) is pure CSS/background-image —
   it never moves. This just duplicates the artwork sequence once so the
   CSS animation's -50% translateX loops seamlessly, per spec. */
(function setupFilmReel() {
  const track = document.getElementById('filmReelTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML; // exactly one duplicate = seamless -50% loop
})();

/* ---------- Fine art: semicircular art wheel (Personal Studio) ----------
   Scroll-driven: the belt shifts as the visitor scrolls past the section,
   rather than auto-playing on a timer. Pieces sit closer together (tighter
   angular step than one-per-slot) so it reads as a continuous belt. */
(function setupArtWheel() {
  const section = document.getElementById('fine-art');
  const stage = document.getElementById('artWheel');
  const track = document.getElementById('artWheelTrack');
  if (!stage || !track) return;
  const pieces = Array.from(track.querySelectorAll('.art-wheel-piece'));
  const count = pieces.length;
  if (!count) return;

  const ANGLE_SPAN = 130;
  const ANGLE_STEP = 26; // tighter than 360/count — pieces sit closer together as a belt
  let offset = 0;

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const centerX = w / 2;
    const centerY = h * 0.42; // optical center: slightly above true geometric middle, since the fan opens downward and reads better a touch higher
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
      const y = centerY + RADIUS * 0.32 * (1 - Math.cos(rad)); // gentle downward curve, not a huge drop

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
    // Scroll-linked: offset derives from how far the Fine Art section has
    // scrolled through the viewport, not from elapsed time.
    let ticking = false;
    function updateFromScroll() {
      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      offset = progress * 220; // degrees of travel across the full scroll range
      layout();
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateFromScroll);
        ticking = true;
      }
    }, { passive: true });
    updateFromScroll();
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
        body: "NOTE FOR ELENA: fill in specifics — e.g. co-founding Brainbow, the student venture that made it to the CREATE competition finals. What was the idea, your role, and what you learned building it from scratch?",
        image: 'assets/images/brainbow-logo.webp'
      } },
    { num: 2, dir: 'A', row: 1, col: 1, answer: 'BOOK',
      clue: 'Has a spine, pages, and an Author usually.',
      achievement: {
        title: 'Published Children\u2019s Book',
        body: 'Illustrated two published children\u2019s books — "My Story About Pans/Pandas" by Owen Ross, and "Ivory Butterflies" by Campbell Colby. NOTE FOR ELENA: add a line about what these projects meant to you or how they came about.',
        image: 'assets/images/pub-ivory-butterflies.webp'
      } },
    { num: 3, dir: 'D', row: 0, col: 5, answer: 'PITCH',
      clue: 'A short way to hook someone on a business idea.',
      achievement: {
        title: 'Top 10 University Pitch Competition',
        body: 'NOTE FOR ELENA: add details on the pitch competition — what you presented, the team, and how you placed.',
        image: null
      } },
    { num: 4, dir: 'A', row: 3, col: 0, answer: 'NONFICTION',
      clue: 'The genre opposite to fiction.',
      achievement: {
        title: 'Maine Nonfiction Award',
        body: 'NOTE FOR ELENA: add details on the Maine Nonfiction Award — what the work was and what it recognized.',
        image: null
      } },
    { num: 5, dir: 'D', row: 3, col: 6, answer: 'TEACHERS',
      clue: 'Schools employ\u2026',
      achievement: {
        title: 'Educational Design Experience',
        body: 'Illustrated "Listening and Learning at School" (written by Jacqui Chait) and a "Stop, Look, Listen" social-emotional learning story — design work made for real classrooms. NOTE FOR ELENA: add more on your educational design experience.',
        image: 'assets/images/edu-stop-look-listen.webp'
      } },
    { num: 7, dir: 'A', row: 5, col: 6, answer: 'AI',
      clue: 'Acronym for a new type of conscious intelligence with no regulation.',
      achievement: {
        title: 'AI Competition Presentation',
        body: 'NOTE FOR ELENA: add details on the AI pitch/competition presentation — what it was about and the outcome.',
        image: null
      } },
    { num: 6, dir: 'A', row: 7, col: 0, answer: 'ALIVE',
      clue: 'Not Dead but\u2026',
      achievement: {
        title: 'Arrive Alive Contest',
        body: 'NOTE FOR ELENA: add details on the Arrive Alive contest — the piece you made and what it was for.',
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
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }
  function closeAchievement() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocusedCell) lastFocusedCell.focus();
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
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = contactForm.querySelector('.contact-form-note');
    note.textContent = "Thanks! (Form isn't connected to email yet — that's next.)";
  });
}
