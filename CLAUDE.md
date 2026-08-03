# elenaparr.com

Personal portfolio for Elena Parr — illustrator and multidisciplinary designer.
Static HTML/CSS/JS. No framework, no build step. Deployed on Vercel from the GitHub repo `elenaparr-site`.

Goal of the site: audience-building across five disciplines (fine art, publications, educational design, branding, and the flagship original project Stellina Mae). It is **not** a job-hunting or client-acquisition site — don't suggest changes that optimize for those.

---

## How work happens here

Edits you make are **local only**. This folder is not wired to git — nothing you change deploys on its own. Elena uploads to GitHub manually (see Deploy, below). Always say clearly when a change is done locally and still needs uploading.

Work the "Ford method": **one section fixed and visually verified before moving to the next.** Don't batch changes across multiple sections.

---

## Working with Elena

- Small iterative batches, confirmed one at a time. Not giant unreviewed changes in one shot.
- **She wants real art-director pushback**, not silent implementation. If a decision seems wrong — hers or a previous Claude's — say so and explain why.
- **Prefer real verification over confident claims.** Measure it, read the computed value, check the actual file. "Let me actually check that" beats asserting.
- Reference images beat verbal description for anything spatial. If a layout problem is ambiguous, ask for a screenshot rather than guessing.
- Favor the safer, simpler fix. Flag deploy risk explicitly before suggesting anything that touches the upload process.

Four phrases that have consistently produced good results:

> "The Canva mockup is the source of truth."
> "Preserve the composition; improve the implementation."
> "Prioritize optical balance over mathematical centering."
> "Delete anything that doesn't strengthen the design."

The Canva mockup is a **structural and content** guide, not a pixel-perfect visual target. The hero is the closest to final intended quality.

---

## Design system

- **Fonts (2 only — hard rule):** Bebas Neue (ALL headers — tall condensed caps, "bolded" via `-webkit-text-stroke` since Bebas ships one weight), Work Sans (body/subheads/UI). Passion One, Space Grotesk, and Fraunces were each tried and dropped — don't reintroduce. Cache-bust: css/js are linked with `?v=N` in index.html — bump N whenever css/js change so browsers fetch fresh.
- **Colors:** WARM JEWEL palette, locked 2026-08-02 (see `:root` in `css/style.css`). Warm-white bg `#FBFAF7` (Porcelain), alternating-section bg `#F7F4F0` (Parchment — a barely-darker warm white; replaced the old `#F3ECE8` pink-gray that read as an ugly cool gray, 2026-08-02), Rich Mahogany ink `#421106`, Royal Plum `#76395D` (dark sections/buttons; `--color-plum-dark #5E2D4A` for button hover), Copperwood `#AE7222` (primary metallic accent — links), Lilac `#C69AB4` (decorative only, = lit-up plum), Bubblegum pink `#FF6DC4` (rare reward pop). Old CSS accent var names (`--color-accent-purple/gold/teal`) are kept as aliases remapped to the new palette; "teal" is retired (only literal teal remnants left are inside the crossword, which is being replaced).
- **Text colour scheme "C" (locked site-wide 2026-08-03):** every standard section header reads **lilac eyebrow (`--color-lilac`, intentionally faint — eyebrows are supplementary), plum title (`--color-plum`), plum-mauve body (`--color-plum-mauve #6E4A63`, a readable plum-family replacement for the too-light lilac)**. Set globally on `.eyebrow`/`.section-title`/`.section-intro` so any standard section inherits it; only override with an explicit approved colour (e.g. the inverted Publications section flips all of this to light). Copper (`--color-copper`) still = links.
- **Nav/header is plum-themed (2026-08-03):** translucent plum bar, cream `#FBFAF7` logo, light-lilac `#E7C9DC` links, lilac `#C69AB4` "Let's Connect" pill with dark-plum label; mobile slide-in panel + hamburger also plum/cream. Leans into the inverted plum bookends (Publications top, Contact bottom).
- **Spacing:** `--sp-1` (0.5rem) → `--sp-16` (8rem), 8px base
- **Timing:** `--dur-fast: 0.3s`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`
- **Radius:** `--radius-art: 30px`
- **Motion philosophy:** calm, scroll-tied where possible. The site should feel like it *responds to you* rather than playing at you on a timer. Fixed-duration autoplay animations are a smell — prefer continuous scroll-linked progress.

### Full colour throughout (grayscale narrative retired 2026-08-02)
The old grayscale-to-colour narrative was removed — it depended on the film reel + crossword, both being reworked. The site is now full colour from the top, which suits the Warm Jewel palette and a colourful illustrator. The hero sketch colour-reveal wipe **stays** (it stands on its own). Do **not** reintroduce a global `filter: grayscale()`.

### Section order — locked, don't reorder without asking
Hero → Publications → **Achievements** → Fine Art (still gallery grid + Personal Studio wheel) → Design for Learning → Branding (logo band + pitch decks) → Stellina Mae → Contact

(**Achievements** was split into its own section 2026-08-03 — it used to live inside Publications. Now that Publications is a dark plum section, Achievements sits just below it as its own **warm-white** section.)

(The standalone **Brainbow reveal** section was removed 2026-08-02 — it duplicated the Brainbow logo now shown in the Branding logo band and singled out one brand. Asset `brainbow-animate.mp4` kept in case it's wanted back.)

**Current build state:** Hero, **Publications** (rebuilt 2026-08-03 as an inverted plum "gallery" section — see decision below), Fine Art grid, the Stellina scene, Contact, and **Branding** (first-pass concept — logo band + click-to-play pitch decks) are **built**. Design for Learning is still a loosely-thrown-together Canva scrap awaiting a per-section mockup. The Achievements crossword (now its own warm-white section) is slated to become an illustrated **sticker sheet** (not built yet).

---

## Locked decisions — don't relitigate without cause

- **Hero color reveal locks permanently** once complete, even scrolling back up. Reversible color read as a glitch; permanent unlock matches the achievement-popup logic.
- **Hero reveal is scroll-linked, not timed.** Progress computed live from scroll position, completing at `heroHeight * 0.5`. An earlier fixed-duration CSS transition version was rejected as "abrupt." An earlier, longer range was rejected because the wipe finished as the hero left the viewport, so nobody ever saw it happen.
- **Hero video sequence:** erase clip holds on "Hi, I'm Elena Parr" for 3.5s → hands off to the "Nice to meet ya" write clip (`playbackRate = 1.1`) → freezes on last frame. Per-letter video files exist but are unused — ignore them.
- **Hero illustration is absolutely positioned as a background layer**, not in document flow, so it fills the viewport behind the text instead of pushing it down.
- **Hero sketch OUTLINE is plum (2026-08-03), not black.** The base line-art layer is a `<div class="hero-sketch-ink">` = a plum fill masked by `hero-sketch.png`'s alpha (`justify-self/align-self: stretch` so it fills the same grid cell as the colour `<img>` — a plain `width:100%` div collapsed to 0 under the parent's `justify-items:center`). Sits on top (z-index 1); the locked colour-reveal still washes colour in underneath it. Don't revert to the black `<img>`.
- **Publications is an inverted plum "gallery" section (rebuilt 2026-08-03).** Deep plum bg makes the near-white book covers pop; bookends the site with plum Contact (cream sections between). ALL text flips light here (scoped to `.section--publications`): light-lilac eyebrow, **lilac title**, light body, cream book titles, lilac datum lines, lilac links. Books are a centered **2-up** of the two front covers (`pub-pans-front`, `pub-ivory` — trimmed from Elena's 16:9 uploads via ffmpeg to exact alpha bounds), each with a **CSS lilac card offset lower-right + one consistent `drop-shadow`** (Elena supplies clean covers, Claude does the effect). The back cover was dropped 2026-08-03 (it out-featured the fronts, and the intro says "my first **two** books"); `pub-pans-back.png` stays in assets if wanted. Then an **Overview** block (lilac heading, light body — copy is Elena's).
- **Fine Art is a still 3×2 grid** of the 6 charcoal/graphite studies — floating cards (no panel background) so the warm background shows around them. This **replaced** the old scrolling film-reel belt; the film-reel CSS/JS is now dead code left in place. (Doll swapped to a hi-res re-crop, `New-Cropped-Doll-Fine-Art.png`.) The rainbow ambient-light that used to glow behind this section was removed 2026-08-02.
- **Branding section (first-pass concept, 2026-08-02):** framed as ART DIRECTION / FAST STORY-DRIVEN DESIGN, **not** illustration — the deck imagery is found/collaged (Pinterest, bg-removed) + DZINE animation on non-commercial class projects, so it's shown as *design/composition*, never as original art or client work. Structure: a **logo lockup band** crowning the section (Myriad · Brainbow · Stellina, height-normalized, no cells; Linda Gail cut for fighting the rainbow set) — now a **seamless auto-marquee** (JS duplicates `#logoTrack`, CSS scrolls -50%; continuous/ambient, not timed-autoplay, so it fits the motion philosophy; hover-pauses, off under reduced-motion) → title/intro → **pitch decks** as click-to-play cards (`<video preload="none">` so the heavy MP4s never load until played). Rainbow swatch belts were removed (competed with the logo band). Copy is still `NOTE FOR ELENA` placeholders. Awaiting Elena's Canva mockup for refinement.
- **Personal Studio wheel duplicates its pieces in the DOM** so tight spacing can wrap the full circle without gaps or thinning. (Open question: does it stay, now that the grid carries Fine Art?)
- **Contact section (fully rebuilt):** oversized Bebas "LET'S CONNECT" (lilac, centered) that pops + parallaxes in on scroll; real `mailto:elenamaria.parr@gmail.com` (copper underline); **no contact form** (deleted — a dead form reads unfinished). The footer is **merged into this section** so it's the last element and the flower meadow at `bottom:0` runs flush to the page base; `overflow:hidden` clips it → no white-space bug. Copyright is `.contact-credit`, absolute in the mahogany soil band.
- **Contact flower meadow:** 9 stacked transparent PNGs (`Grass-1..5`, `flower-1..4`, all 865×812). Gentle uniform idle sway (one shared "wind") **plus** a per-flower "piano-key" lift+enlarge on cursor proximity, driven by each layer's **measured centroid x** (`CENTERS` array in main.js). Soil band `.section--contact::after` height scales with `9vw` so it always meets the flower body.
- **Stellina is a full-screen (100vh) immersive scene:** 12 stacked PNG layers (`blue_sky_8` back → `stellina_tree_1` front, all 1366×768, injected + parallaxed by `setupStellinaScene`; front layers travel more). Seamless looping Dream Train (2 offset copies), drifting campfire smoke, a slow ±2% horizontal **cloud drift** (`.stel-clouds`, on the img so it composes with the wrap's parallax — added 2026-08-02), and a top sky-fade at **z-index 7 (between sky and castle)** so only the sky fades, not the castle/pine. "Follow the story" button sits under the intro; scene flows straight into Contact (`.section--stellina { padding-bottom: 0 }`).

---

## Traps that have actually bitten this project

**GSAP breaks `position: fixed`.** ScrollTrigger applies a transform to `<body>`, so any fixed descendant positions relative to that transformed ancestor instead of the viewport. This *only manifests live* — GSAP loads from CDN and never appears in offline testing. **Anything that tests fine locally but misbehaves around positioning or scrolling once deployed should be suspected of this first.** Fix pattern: `position: absolute` against a `position: relative` ancestor (`#main`), tracking position manually via a scroll listener if it must stay viewport-relative. Used for both the ambient light and the achievement popup.

**Stacking contexts trap z-index.** The achievement popup was nested inside Publications' `.section-inner` (which has `z-index: 2`), so its own `z-index: 200` couldn't outrank later sections and it rendered behind the Personal Studio wheel, unclickable. Fixed by making the popup a **direct child of `#main`** — a sibling of every section, not nested inside one.

**`overflow-x: hidden` + `overflow-y: visible` on the same element silently computes to `overflow-y: auto`** per spec. Caused a hover-zoom crop bug. Use `clip-path` instead; it has no axis coupling.

**An animated transform always beats a static one on the same element.** A hover `scale()` was being eaten by a keyframe `translateY`. Move the hover transform to a non-animated outer wrapper.

**Don't delete CSS that merely looks redundant.** A "dead code cleanup" pass removed what appeared to be a duplicate `.archive {}` rule that turned out to be the only declaration of `display: grid` — silently broke the whole Publications layout. Check the specific properties, not visual similarity.

**404 on an asset is almost always a filename mismatch, not a deploy problem.** Check exact spelling, capitalization, and word order against `assets/images/`. This cost real time twice over `hero-sketch-color.png` vs `hero-color-sketch.png` — **the correct name is `hero-sketch-color.png`**, confirmed and locked. (Note: Stellina/meadow assets use mixed casing, e.g. `Grass-1.png`, `Train_4.png`, `blue_sky_8.png` — match it exactly.)

**The local browser-preview pane runs at `viewportH: 0`.** That single fact explains most verification pain: `vh` units read as 0px, `scrollTo` does nothing, screenshots snap to the top, and rAF animations pause. It's a pane limitation, **not broken code** — verify viewport/scroll/animation behaviour structurally (computed styles, `fetch(...,{cache:'no-store'})` on the served file, canvas `getImageData` pixel measurement) and have Elena confirm the *feel* on her real browser. Measuring transparent-PNG content bounds via canvas (padding, centroids, density-per-row) was the key to positioning the meadow precisely.

**Cache-busting / stale serving.** css/js are linked as `css/style.css?v=N` + `js/main.js?v=N`. **Bump N on every css/js change** or the preview — and Elena's deploy — serves stale files. This bit us repeatedly (missing flowers, un-run JS). Current version: **v=33**.

**Footer-outside-`#main` stacking.** To layer the meadow OVER the footer but BELOW the heading text, the clean fix was **merging the footer into the contact section** (making it the last element), not fighting z-index across the `#main`/`<footer>` boundary. Do **not** give `#main` a z-index (caused an earlier bug).

**Big un-optimized PNGs cause scroll jank.** The Stellina layers were multi-MB (blue_sky_8 alone was 2MB). Fix: TinyPNG (same filenames, ~-80% on the PNGs) + don't `will-change`-promote many full-size layers + only run the parallax transform when the scene is near the viewport.

---

## Deploy

Elena deploys by hand. The process:

1. Delete the current contents of the GitHub repo root
2. Drag in **5 items** from the unzipped folder — `index.html`, `css/`, `js/`, `assets/`, and `CLAUDE.md` — directly to the root, **not** the wrapper folder and **not** the zip
3. Commit

**Replace all five every time.** Partial replaces have repeatedly served stale code: `css` and `js` change almost every session even when the work felt like it was "only about images."

The real production URL is **`elenaparr-site.vercel.app`**. URLs with a random hash (`elenaparr-site-o3ftjdxj4-...`) are permanently frozen to one old deployment and never update — a common source of "why isn't my change showing up."

For a one-line change like a filename swap, a **direct GitHub edit** (pencil icon → change the string → commit) is much safer than a full re-upload.

---

## Open items

**Done (session 1, 2026-08-02):** Warm Jewel palette locked · grayscale removed · fonts → Bebas Neue + Work Sans · Fine Art film-reel → still grid · **Contact fully rebuilt** (mailto, piano-key flower meadow, merged footer) · **Stellina full-screen parallax scene** (train + smoke + sky fade) · doll re-cropped hi-res · all assets TinyPNG-compressed.

**Done (session 2, 2026-08-02):** **Branding first-pass built** (logo band + click-to-play pitch decks; swatch belts removed) · Brainbow reveal section removed · ambient rainbow-light removed · **pitch videos compressed with ffmpeg (83 MB → 16 MB, ~81% off; originals in `assets/video/_originals_full/`)** · real Nintendo poster frame grabbed · Stellina cloud drift added · **background alt → Parchment `#F7F4F0`** (base Porcelain `#FBFAF7`) · button hover on-palette (`--color-plum-dark`). Cache at **v=22**.

**Done (session 3, 2026-08-03):** **Text scheme "C" locked site-wide** (lilac eyebrow / plum title / plum-mauve body) · **nav → plum theme** · **Publications rebuilt as inverted plum gallery** (3-up trimmed book covers + CSS lilac offset cards + drop-shadow + Overview block) · **Achievements split into its own warm-white section** · **hero sketch outline recoloured to plum** (masked div) · **Branding logo band → seamless auto-marquee** · section titles bumped to ~120px uniform (fit-to-width was tried and reverted — Elena preferred the smaller uniform size) · flamingo wheel bug fixed (lazy-load vs transform). Cache at **v=33**. **Not yet uploaded to GitHub** — big backlog since v=15.

**Known bugs, queued:** none currently.

**Next up / not built yet:**
- Achievements crossword → illustrated **sticker sheet** (decided direction; crossword still live in DOM/JS for now)
- Publications / Design for Learning / Branding — still Canva scraps; rebuild each from Elena's mockup
- Ambient rainbow-light **removed** 2026-08-02 (clashed with the jewel palette). `.ambient-light`/`.light-blob` CSS kept dormant + `setupAmbientLight()` guarded, in case a jewel-palette version is ever reworked.
- Intro + Fine Art "luxury scroll" polish pass
- New hero videos re-exported on the new warm-white bg (currently baked on cream) — Elena's to do

**Content boundary (IMPORTANT):** Elena writes **all** art and **all** copy herself — podcast scripts, educational/social-emotional text, achievement stories, section copy — and it's reviewed by education/behavioral specialists. Claude scaffolds structure/code, organizes/renames assets, and flags brand-consistency drift; use "NOTE FOR ELENA" placeholders, never generate the substance. When existing prior-Claude copy reads off (e.g. an old crossword clue), flag it — don't rewrite it.

**Waiting on Elena for content:**
- Achievement stories: FOUNDER, PITCH, NONFICTION, AI, ALIVE (placeholders in `main.js`)
- Brand card descriptions + edu "Stop · Look · Listen" copy (lorem ipsum)
- Social handles (email is set: `elenamaria.parr@gmail.com`; socials pending a third-party aggregator)
- Brainbow GIF re-export; color swatch files re-export

**Bigger picture:** Elena is building a larger business (podcast w/ recorded music + products, newsletter, multi-platform video). Claude can help beyond this site — copy, launch/marketing planning, landing pages, asset organization — but that's a **separate project → separate chat/folder**. Not art or podcast/educational writing (hers).

**Undecided:**
- Whether Stellina Mae needs a dedicated `/stellina` page in addition to its homepage section
- Hero eyebrow line (Portland, Maine + email) above "Hi, I'm Elena," in the style of spencergabor.work — discussed, not built

**Unpolished but functional:**
- Mobile layouts (crossword; the 100vh Stellina scene crops hard on portrait)
- Spacing token cleanup — some additions use raw rem instead of `--sp-*`
