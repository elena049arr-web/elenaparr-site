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
    // Hold on the static first frame ("Hi, I'm Elena") for a beat before
    // erasing starts. This is now also exactly the buffer that lets the
    // arrival pop-in (below) finish visually before the erase/rewrite
    // story continues — no explicit coordination needed between them.
    setTimeout(() => {
      heroClipErase.play().catch(() => {});
    }, 3500);
    heroClipErase.addEventListener('ended', () => {
      heroClipErase.classList.add('is-hidden');
      heroClip.classList.remove('is-hidden');
      heroClip.currentTime = 0;
      heroClip.playbackRate = 1.1; // sped up 10% per feedback
      heroClip.play().catch(() => {});
    });
    // No swap on 'ended' — the video simply pauses on its last frame and
    // stays exactly where it is. Swapping to a separate static image (even
    // with a crossfade) introduced a visible seam/gap; freezing in place
    // removes that entirely since nothing changes elements.
  }
}
// "Hi, I'm Elena" (the static first frame, always visible before the erase
// clip starts) and the tagline now pop in together as a first beat, as
// soon as the visitor arrives — before the erase/rewrite story begins.
revealHeroWriting();
revealHeroTagline();

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
  const viewport = document.querySelector('.film-reel-viewport');
  if (!track) return;
  track.innerHTML += track.innerHTML; // exactly one duplicate = seamless -50% loop

  if (prefersReducedMotion) return; // falls back to a plain, manually-scrollable strip (see CSS)

  const SPEED = 0.04; // % of the loop advanced per pixel of vertical page scroll
  const WHEEL_SPEED = 0.05; // % of the loop advanced per pixel of horizontal wheel/trackpad input
  let horizontalOffset = 0; // accumulated from direct horizontal input, independent of page scroll
  let ticking = false;

  function positionTrack() {
    // both drivers combine: vertical page scroll keeps it moving as you pass
    // through the section, horizontal wheel/trackpad input lets you nudge it
    // directly while looking right at it, without needing to scroll past it
    let pct = (window.scrollY * SPEED + horizontalOffset) % 50;
    if (pct < 0) pct += 50; // JS modulo can return negative — wrap correctly either direction
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

  if (viewport) {
    let pendingDelta = 0;
    let wheelTicking = false;
    viewport.addEventListener('wheel', (e) => {
      // only hijack when the gesture is meaningfully horizontal, so normal
      // vertical page-scrolling over the reel still works untouched
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        pendingDelta += e.deltaX;
        if (!wheelTicking) {
          requestAnimationFrame(() => {
            horizontalOffset += pendingDelta * WHEEL_SPEED;
            pendingDelta = 0;
            positionTrack();
            wheelTicking = false;
          });
          wheelTicking = true;
        }
      }
    }, { passive: false });
  }
})();

/* ---------- Branding logo marquee: duplicate the set once for a seamless auto-loop.
   Skipped under reduced motion (CSS then wraps them into a static centered row). ---------- */
(function setupLogoMarquee() {
  const track = document.getElementById('logoTrack');
  if (!track || prefersReducedMotion) return;
  track.innerHTML += track.innerHTML; // 2 identical halves → CSS scroll -50% loops seamlessly
})();

/* ---------- Design for Learning: social-story "belt" — duplicate the 3 numbered pages
   once so the CSS translateX(-50%) auto-scroll loops seamlessly. Skipped under reduced
   motion (CSS then lets the belt scroll manually). ---------- */
(function setupStoryBelt() {
  const track = document.getElementById('storyBelt');
  if (!track || prefersReducedMotion) return;
  track.innerHTML += track.innerHTML;
})();

/* Fit-to-width section titles were tried 2026-08-03 (Elena's "B") and reverted —
   she preferred the smaller uniform size. Titles now use the CSS clamp on
   .section-title (~115px cap). */

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

/* Brainbow reveal removed 2026-08-02 — see index.html note. */

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

/* ---------- Achievements sticker sheet (2026-08-03) — replaces the crossword.
   Each sticker opens the achievement popup with that sticker "pinned" to the top
   of the story card. Owns the popup open/close wiring (setupCrossword is inert now).
   NOTE FOR ELENA: bodies are yours to finalize — placeholders/notes carried over,
   with FOUNDER corrected to Stellina and CREATE folded into the Pitch entry. ---------- */
(function setupStickerSheet() {
  const sheet = document.getElementById('stickerSheet');
  if (!sheet) return;

  // pos = scatter placement on the cream board: l/t are the sticker's CENTRE (% of
  // board), w = width (% of board), r = rotation (deg). Derived from Elena's mockup;
  // easy to nudge. The Pitch bear isn't in the mockup — placed lower-right to balance.
  const STICKERS = [
    { sticker: 'founder_sticker.png', label: 'Founder', pos: { l: 31, t: 80, w: 21, r: -3 },
      ach: { title: "Founder — Stellina Mae", image: null,
        body: "In 2025, I began working on a huge immersive project to release podcasts and music, and to design an animated interactive site.",
        link: { label: "Learn more", href: "#stellina" } } },
    { sticker: 'art_sticker.png', label: 'Published Books', pos: { l: 80, t: 55, w: 15, r: 5 },
      ach: { title: "Published Children's Books", image: null,
        body: "In 2019, I got my first opportunity at 15 to illustrate a children's book that was advised and written in conjunction with Dr. Avery to educate on children's health regarding a lesser-known mental health condition spurred on by ticks and mold." } },
    { sticker: 'pitch_sticker.png', label: 'Pitch Competition', pos: { l: 71, t: 81, w: 16, r: -4 },
      ach: { title: "C.R.E.A.T.E Pitch — Top 10", image: null,
        body: "In 2024, I participated in the C.R.E.A.T.E pitch competition and came in the top 10. I pitched 'Brainbow', an interactive site for parents and kids with autism to guide them towards state resources, tools, and community." } },
    { sticker: 'nonfiction_award_sticker.png', label: 'Nonfiction Award', pos: { l: 60, t: 57, w: 21, r: -12 },
      ach: { title: "Youth Non-Fiction Award", image: null,
        body: "In 2019, I won the Youth Non-Fiction Award, one of the categories of the Maine Literary Awards, put on by the Maine Writers and Publishers Alliance." } },
    { sticker: 'teacher_sticker.png', label: 'Design for Learning', pos: { l: 40, t: 54, w: 18, r: -5 },
      ach: { title: "Co-Lead Teacher, Goldman Family Preschool", image: null,
        body: "In 2022, I became a floater for a few months before accepting a job as co-lead teacher at the Goldman Family Preschool, a Reggio Emilia-designed program.",
        link: { label: "Learn more", href: "#design-learning" } } },  // → Design for Learning section (confirmed)
    { sticker: 'ai_comp_sticker.png', label: 'AI Competition', pos: { l: 51, t: 83, w: 14, r: 3 },
      ach: { title: "A.I. Innovation & Sustainability Pitch", image: null,
        body: "In 2026, I participated in an A.I. innovation and sustainability pitch competition with only a three-day turnaround to make a presentation and pitch for a panel of USM judges.",
        link: { label: "See the presentation", href: "#branding" } } },  // → the USM AI deck lives in the Presentation section (#branding, being relabeled)
    { sticker: 'arrive_allive_sticker.png', label: 'Arrive Alive', pos: { l: 18, t: 59, w: 12, r: -6 },
      ach: { title: "Arrive Alive Award — First Place", image: null,
        body: "In 2022, I won first place in the Arrive Alive award in the painting category, put on annually by the law offices of Joe Bornstein for the state of Maine." } },
  ];

  // --- render the stickers ---
  STICKERS.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'sticker';
    const p = s.pos || { l: 50, t: 50, w: 16, r: 0 };
    li.style.left = p.l + '%';
    li.style.top = p.t + '%';
    li.style.width = p.w + '%';
    li.style.setProperty('--rot', (p.r || 0) + 'deg');
    const btn = document.createElement('button');
    btn.className = 'sticker-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', `${s.label} — open story`);
    btn.innerHTML = `<img src="assets/images/${s.sticker}" alt="" loading="lazy">`;
    btn.addEventListener('click', () => openAchievement(s));
    const label = document.createElement('span');
    label.className = 'sticker-label';
    label.textContent = s.label;
    li.append(btn, label);
    sheet.appendChild(li);
  });

  // --- popup wiring (same #achievementOverlay DOM; sticker pinned to the card) ---
  const overlay = document.getElementById('achievementOverlay');
  const stickerEl = document.getElementById('achievementSticker');
  const titleEl = document.getElementById('achievementTitle');
  const imageEl = document.getElementById('achievementImage');
  const bodyEl = document.getElementById('achievementBody');
  const closeBtn = document.getElementById('achievementClose');
  const linkEl = document.getElementById('achievementLink');
  const scrollEl = overlay.querySelector('.achievement-scroll');
  let lastFocused = null;

  function openAchievement(s) {
    lastFocused = document.activeElement;
    stickerEl.innerHTML = `<img src="assets/images/${s.sticker}" alt="">`;
    titleEl.textContent = s.ach.title;
    imageEl.innerHTML = s.ach.image ? `<img src="${s.ach.image}" alt="">` : '';
    imageEl.style.display = s.ach.image ? '' : 'none';
    bodyEl.textContent = s.ach.body;
    // optional "learn more" button (the blurbs that ended in "…")
    const lk = s.ach.link;
    if (lk) {
      linkEl.textContent = lk.label;
      linkEl.href = lk.href;
      const external = !lk.href.startsWith('#');
      if (external) { linkEl.target = '_blank'; linkEl.rel = 'noopener noreferrer'; }
      else { linkEl.removeAttribute('target'); linkEl.removeAttribute('rel'); }
      linkEl.hidden = false;
    } else {
      linkEl.hidden = true;
    }
    if (scrollEl) scrollEl.scrollTop = 0;
    overlay.style.top = `${window.scrollY}px`; // align with the viewport (body is GSAP-transformed; can't use position:fixed)
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus({ preventScroll: true });
  }
  function closeAchievement() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  }
  closeBtn.addEventListener('click', closeAchievement);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAchievement(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeAchievement();
  });
  // "learn more" — internal #section links close the popup and smooth-scroll; external links open normally
  linkEl.addEventListener('click', (e) => {
    const href = linkEl.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      closeAchievement();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
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

function revealHeroWriting() {
  const el = document.getElementById('heroWriting');
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('is-revealed');
    });
  });
}

/* ---------- Hero sketch: one-time color wipe reveal ----------
   Reveals the colored layer underneath the line art with a left-to-right
   wipe as the visitor scrolls away from the hero — then locks in
   permanently (unobserve) rather than staying continuously scroll-tied.
   See the CSS comment on .hero-sketch-color for why this is a one-time
   unlock rather than an always-reversible effect. */
(function setupHeroSketchReveal() {
  const colorLayer = document.getElementById('heroSketchColor');
  const heroSection = document.getElementById('top');
  if (!colorLayer || !heroSection) return;

  if (prefersReducedMotion) {
    colorLayer.style.setProperty('--reveal', '1');
    return;
  }

  // Scroll-linked, but eased: scroll position sets a target reveal (0..1),
  // then a rAF loop lerps the *displayed* value toward it. That slight lag is
  // what reads as luxury — the colour keeps washing in for a beat after you
  // stop scrolling, instead of snapping to the scrollbar. Completes a touch
  // slower than before (0.6 of a hero-height) and locks permanently at fully
  // revealed — never reverses on scrolling back up.
  const SETTLE = 0.06;   // lerp factor — lower = slower / silkier
  const RANGE = 0.6;     // fraction of hero height over which it completes
  let current = 0, target = 0, locked = false, rafId = null;

  function computeTarget() {
    const end = heroSection.offsetHeight * RANGE;
    target = Math.max(0, Math.min(1, window.scrollY / end));
  }
  function tick() {
    current += (target - current) * SETTLE;
    const settled = Math.abs(target - current) < 0.0015;
    if (settled) current = target;
    colorLayer.style.setProperty('--reveal', current.toFixed(4));
    if (current >= 0.999) {                    // complete → lock forever
      colorLayer.style.setProperty('--reveal', '1');
      locked = true; rafId = null; return;
    }
    rafId = settled ? null : requestAnimationFrame(tick); // idle until next scroll
  }
  computeTarget();
  current = target;                            // no jump if the page loads mid-scroll
  colorLayer.style.setProperty('--reveal', current.toFixed(4));
  if (current >= 0.999) { colorLayer.style.setProperty('--reveal', '1'); locked = true; }
  window.addEventListener('scroll', () => {
    if (locked) return;
    computeTarget();
    if (rafId == null) rafId = requestAnimationFrame(tick);
  }, { passive: true });
})();

/* ---------- Contact meadow: cursor-rustled grass & flowers ----------
   The 9 layers (5 grass + 4 flowers) share one canvas and stack into a
   single cluster. Each is injected as its own <img> so it can sway
   independently: a gentle idle breeze keeps the field alive, and the cursor
   pushes nearby blades away from it (spring physics → a springy "rustle").
   The meadow is pointer-events:none — we read the cursor from the section,
   so the blades react without ever blocking a click on the email. */
(function setupContactMeadow() {
  const meadow = document.getElementById('contactMeadow');
  const section = document.getElementById('contact');
  if (!meadow || !section) return;

  const LAYERS = [
    'Grass-1.png', 'Grass-2.png', 'Grass-3.png', 'Grass-4.png', 'Grass-5.png',
    'flower-1.png', 'flower-2.png', 'flower-3.png', 'flower-4.png'
  ];
  LAYERS.forEach((file, i) => {
    const img = document.createElement('img');
    img.src = 'assets/images/' + file;
    img.className = 'meadow-blade';
    img.alt = '';
    img.loading = 'lazy';
    img.style.zIndex = String(i); // grass behind, flowers in front (source order)
    meadow.appendChild(img);
  });

  if (prefersReducedMotion) return; // static cluster, no rustle

  // measured centroid x (0..1) of each layer's artwork, so the "piano key" lift
  // follows the cursor to the actual plant under it (order matches LAYERS above)
  const CENTERS = [0.322, 0.338, 0.217, 0.104, 0.194, 0.12, 0.414, 0.345, 0.245];
  const blades = Array.from(meadow.querySelectorAll('.meadow-blade')).map((el, i) => {
    const cx = CENTERS[i] != null ? CENTERS[i] : 0.3;
    el.style.transformOrigin = (cx * 100).toFixed(1) + '% bottom'; // lift/grow from its own base
    return { el, center: cx, mag: 0.9 + 0.2 * (i / 8), lift: 0, liftVel: 0 };
  });

  let pointerX = null, pointerActive = false;
  section.addEventListener('pointermove', (e) => {
    const r = meadow.getBoundingClientRect();
    pointerX = (e.clientX - r.left) / r.width; // 0..1 across the meadow
    pointerActive = true;
  }, { passive: true });
  section.addEventListener('pointerleave', () => { pointerActive = false; });

  const title = document.querySelector('.contact-title');

  // Gentle uniform sway (lowered), plus a per-flower "piano key" lift: whichever
  // plant the cursor is over raises + enlarges, springing back as you move on.
  let last = performance.now();
  function frame(now) {
    const t = now / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const wind = Math.sin(t * 0.7) * 1.5; // gentle uniform idle sway (lowered)
    blades.forEach((b) => {
      let target = 0;
      if (pointerActive && pointerX != null) {
        target = Math.max(0, 1 - Math.abs(pointerX - b.center) / 0.14); // wider hit-zone = more playable
      }
      b.liftVel += (target - b.lift) * 95 * dt - b.liftVel * 12 * dt; // snappier spring w/ a little bounce = satisfying
      b.lift += b.liftVel * dt;
      const raise = (-b.lift * 42).toFixed(1);      // rise up (bigger)
      const scale = (1 + b.lift * 0.30).toFixed(3); // and enlarge (much more)
      b.el.style.transform = 'translateY(' + raise + 'px) scale(' + scale + ') skewX(' + (wind * b.mag).toFixed(2) + 'deg)';
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Scroll motion (scroll-linked, no fixed positioning — GSAP-safe):
  //  • heading POPS in (scale + fade) as it enters, then drifts up gently
  //  • the meadow parallaxes at a slower rate → text & flowers move
  //    independently, for layered depth
  let sTick = false;
  function scrollMotion() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
    if (title) {
      const enter = Math.min(1, p / 0.25);
      const ease = 1 - Math.pow(1 - enter, 3);   // easeOutCubic
      const scale = 0.82 + 0.18 * ease;          // pronounced pop — grows into place
      const drift = (p - 0.5) * -170;            // pronounced parallax drift (±85px) — clearly visible now
      title.style.opacity = ease.toFixed(3);
      title.style.transform = 'translateY(' + drift.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
    }
    // meadow stays rooted at the page base (no parallax) so the stems don't lift off the bottom
    sTick = false;
  }
  scrollMotion();
  window.addEventListener('scroll', () => {
    if (!sTick) { requestAnimationFrame(scrollMotion); sTick = true; }
  }, { passive: true });
  window.addEventListener('resize', scrollMotion);
})();

/* ---------- Stellina immersive scene ----------
   Injects the 12 layered PNGs (same canvas) back→front, then parallaxes each
   on scroll: front layers travel more than distant ones for real depth. The
   Dream Train (translateX loop) and campfire smoke are CSS animations on their
   own layers. Layers are scaled ~1.12 so the parallax shift never reveals an
   edge. Fully static under reduced motion. */
(function setupStellinaScene() {
  const scene = document.getElementById('stellinaScene');
  if (!scene) return;
  const fade = scene.querySelector('.stellina-scene-fade');
  const LAYERS = [
    { f: 'blue_sky_8', d: 8 },
    { f: 'stars_7', d: 7 },
    { f: 'River_background_6', d: 6 },
    { f: 'clouds_gradient_top_to_blend_6', d: 6, cls: 'stel-clouds' },
    { f: 'Castle_mountains_5', d: 5 },
    { f: 'Birds_5', d: 5 },
    { f: 'Train_4', d: 4, cls: 'stel-train' },
    { f: 'Train_4', d: 4, cls: 'stel-train stel-train-b' }, // 2nd train, offset half a cycle → always one crossing
    { f: 'Forest_rivers_edge_3', d: 3 },
    { f: 'Pine_trees_2', d: 2 },
    { f: 'Campfire_behind_smoke_1', d: 1 },
    { f: 'Smoke_1', d: 1, cls: 'stel-smoke' },
    { f: 'stellina_tree_1', d: 1 }
  ];
  const layers = LAYERS.map((L, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'stel-layer';
    wrap.style.zIndex = String(i * 2); // explicit stacking so the fade (z-index 7) sits between sky and castle
    const img = document.createElement('img');
    img.src = 'assets/images/' + L.f + '.png';
    img.alt = '';
    img.loading = 'lazy';
    if (L.cls) img.className = L.cls;
    wrap.appendChild(img);
    scene.insertBefore(wrap, fade); // keep the fade + viewer above the layers
    return { wrap, depth: L.d };
  });

  if (prefersReducedMotion) return; // static scene (CSS turns the train/smoke off too)

  let ticking = false;
  function parallax() {
    const rect = scene.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
    layers.forEach(({ wrap, depth }) => {
      const frontness = (9 - depth) / 8;            // 1 (front) … 0.125 (back)
      const y = (p - 0.5) * -46 * frontness;        // nearer layers travel more
      wrap.style.transform = 'translateY(' + y.toFixed(1) + 'px) scale(1.12)';
    });
    ticking = false;
  }
  parallax();
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', parallax);
})();
