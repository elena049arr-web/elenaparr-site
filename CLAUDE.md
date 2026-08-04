# elenaparr.com

Personal portfolio for Elena Parr — illustrator and multidisciplinary designer.
Static HTML/CSS/JS. No framework, no build step. Deployed on Vercel from the GitHub repo `elenaparr-site`.

Goal of the site: audience-building across five disciplines (fine art, publications, educational design, branding, and the flagship original project Stellina Mae). It is **not** a job-hunting or client-acquisition site — don't suggest changes that optimize for those.

---

## How work happens here

Edits are **local only** until uploaded. This folder (`~/Desktop/elena-parr-site-folder`) **is the git clone** of `github.com/elena049arr-web/elenaparr-site` (remote `origin`, branch `main`) — it's the single source of truth. (An old unzipped copy `elenaparr-site-main` caused a two-folder mix-up; it was archived to `~/Desktop/_archive/` — don't serve or edit from there.) Elena has been deploying by **manually uploading** to GitHub (see Deploy), but since a real remote exists a `git push` would also deploy (Vercel auto-builds) — offer it, but never push without her explicit say-so. The local preview server should be rooted at THIS folder (`python3 -m http.server 8000 --directory ~/Desktop/elena-parr-site-folder`). Always say clearly when a change is local and still needs uploading.

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
- **Colors:** WARM JEWEL palette, locked 2026-08-02 (see `:root` in `css/style.css`). Warm-white bg `#FBFAF7` (Porcelain), alternating-section bg `#F7F4F0` (Parchment — a barely-darker warm white; replaced the old `#F3ECE8` pink-gray that read as an ugly cool gray, 2026-08-02), Rich Mahogany ink `#421106`, Royal Plum `#76395D` (dark sections/buttons; `--color-plum-dark #5E2D4A` for button hover), Copperwood `#AE7222` (primary metallic accent — links), Lilac `#C69AB4` (decorative only, = lit-up plum), Bubblegum pink `#FF6DC4` (rare reward pop). Old CSS accent var names (`--color-accent-purple/gold/teal`) are kept as aliases remapped to the new palette; "teal" is retired (the crossword that held the last teal remnants is gone — replaced by the sticker sheet).
- **Text colour scheme "C" (locked site-wide 2026-08-03):** every standard section header reads **lilac eyebrow (`--color-lilac`, intentionally faint — eyebrows are supplementary), plum title (`--color-plum`), plum-mauve body (`--color-plum-mauve #6E4A63`, a readable plum-family replacement for the too-light lilac)**. Set globally on `.eyebrow`/`.section-title`/`.section-intro` so any standard section inherits it; only override with an explicit approved colour (e.g. the inverted Publications section flips all of this to light). Copper (`--color-copper`) still = links.
- **Nav/header is plum-themed (2026-08-03):** translucent plum bar, cream `#FBFAF7` logo, light-lilac `#E7C9DC` links, lilac `#C69AB4` "Let's Connect" pill with dark-plum label; mobile slide-in panel + hamburger also plum/cream. Leans into the inverted plum bookends (Publications top, Contact bottom).
- **Spacing:** `--sp-1` (0.5rem) → `--sp-16` (8rem), 8px base
- **Timing:** `--dur-fast: 0.3s`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`
- **Radius:** `--radius-art: 30px`
- **Motion philosophy:** calm, scroll-tied where possible. The site should feel like it *responds to you* rather than playing at you on a timer. Fixed-duration autoplay animations are a smell — prefer continuous scroll-linked progress.

### Full colour throughout (grayscale narrative retired 2026-08-02)
The old grayscale-to-colour narrative was removed — it depended on the film reel + crossword, both being reworked. The site is now full colour from the top, which suits the Warm Jewel palette and a colourful illustrator. The hero sketch colour-reveal wipe **stays** (it stands on its own). Do **not** reintroduce a global `filter: grayscale()`.

### Section order — locked, don't reorder without asking
Hero → **About** → **Achievements** (illustrated sticker sheet) → Fine Art (gallery grid + Personal Studio wheel) → Design for Learning → **Presentation** (pitch decks) → Stellina Mae → Contact

**Section renames (2026-08-03), both keep their old `id`s** so nav/anchor links don't break:
- **"Publications" → "About"** — `id="publications"` kept. It's the site's intro/who-she-is section now; the two published books live inside it as a supporting beat. (Publications graduates back to its own section later when there's volume.) Nav label, eyebrow, and `<h2>` all say "About".
- **"Branding" → "Presentation"** — `id="branding"` kept. Reframed around the pitch decks. The Achievement "See the presentation" (AI) button points here (`#branding`).

(**Achievements** was split into its own section 2026-08-03 — used to live inside Publications. It's a **warm-white** section sitting just below the plum About.)

(The standalone **Brainbow reveal** section was removed 2026-08-02. Asset `brainbow-animate.mp4` kept in case it's wanted back.)

**Current build state (2026-08-04, session 6):** ALL sections built + heavily reworked this session — **Hero** (videos SCRAPPED; now a bespoke interactive "HI, I'M ELENA PARR" title from Elena's per-letter PNGs — bubble-pop staggered entrance, hover-zoom letters, aligned to the tagline), **About** (rebuilt AGAIN to Elena's mockup: tight 2-col "newspaper brick" masonry — justified copy, lilac "mat" image cards, Buttons comic + 2 books + trimmed Brainbow logo), **Achievements** (sticker sheet, unchanged), **Fine Art** (grid → click-through DECK + Personal Studio wheel now labeled with ghost titles & evenly spaced), **Design for Learning** (blink retimed, mouth decoupled), **Presentation** (copy = Elena's revised words, Bueckers×Warner Bros correction, cards → light-lilac + even), Stellina scene, Contact. **The big remaining work: MOBILE (untouched) then THE DEPLOY (still nothing live).** Context: portfolio link for a creative director; the CD meeting was 2026-08-05.

---

## Locked decisions — don't relitigate without cause

> **⚠ Session 6 (2026-08-04) SUPERSEDED several of these — read the "Done (session 6)" block below first.** In particular: the **Hero video sequence is GONE** (replaced by the interactive per-letter title); **Fine Art is now a click-through DECK**, not a still grid; **About is now a 2-col "newspaper brick" masonry**, not the 2-col books-left/overview-right gallery. The hero **sketch colour-reveal + plum sketch-ink layer still hold**. Entries below are kept for history — cross-check against session 6 before acting.

- **Hero color reveal locks permanently** once complete, even scrolling back up. Reversible color read as a glitch; permanent unlock matches the achievement-popup logic.
- **Hero reveal is scroll-linked, not timed.** Progress computed live from scroll position, completing at `heroHeight * 0.5`. An earlier fixed-duration CSS transition version was rejected as "abrupt." An earlier, longer range was rejected because the wipe finished as the hero left the viewport, so nobody ever saw it happen.
- **Hero video sequence:** erase clip holds on "Hi, I'm Elena Parr" for 3.5s → hands off to the "Nice to meet ya" write clip (`playbackRate = 1.1`) → freezes on last frame. Per-letter video files exist but are unused — ignore them.
- **Hero illustration is absolutely positioned as a background layer**, not in document flow, so it fills the viewport behind the text instead of pushing it down.
- **Hero sketch OUTLINE is plum (2026-08-03), not black.** The base line-art layer is a `<div class="hero-sketch-ink">` = a plum fill masked by `hero-sketch.png`'s alpha (`justify-self/align-self: stretch` so it fills the same grid cell as the colour `<img>` — a plain `width:100%` div collapsed to 0 under the parent's `justify-items:center`). Sits on top (z-index 1); the locked colour-reveal still washes colour in underneath it. Don't revert to the black `<img>`.
- **About (was "Publications") is an inverted plum "gallery" section (rebuilt 2026-08-03; renamed to About session 4).** Deep plum bg makes the near-white book covers pop; bookends the site with plum Contact (cream sections between). ALL text flips light here (scoped to `.section--publications` — class kept). Books + Overview now sit in a **2-column `.about-layout`**: books **left-flanked** (`justify-content:start`), Overview copy in a **right column** to balance them (pro working photos will join the left column later). The two front covers (`pub-pans-front`, `pub-ivory`) each get a CSS lilac offset card + `drop-shadow`. Section padding was **normalised to the standard 128/128** (session 4 — it had an odd 48/64 override, out of rhythm). Overview copy + a real About intro are **Elena's to write** (still placeholder in the right column).
- **Fine Art is a still 3×2 grid** of the 6 charcoal/graphite studies — floating cards (no panel background) so the warm background shows around them. This **replaced** the old scrolling film-reel belt; the film-reel CSS/JS is now dead code left in place. (Doll swapped to a hi-res re-crop, `New-Cropped-Doll-Fine-Art.png`.) The rainbow ambient-light that used to glow behind this section was removed 2026-08-02.
- **Presentation (was "Branding"; renamed + reworked session 4).** Framed as ART DIRECTION / FAST STORY-DRIVEN DESIGN, **not** illustration — deck imagery is found/collaged (Pinterest, bg-removed) + DZINE animation on non-commercial class projects, so it's shown as *design/composition*, never original art or client work. **The logo lockup band (Myriad · Brainbow · Stellina auto-marquee) was REMOVED** session 4 — it was identity work orphaned atop a section now about presentations (`setupLogoMarquee` guards the missing `#logoTrack`; assets kept). Section now = title/intro → **3 pitch-deck cards** as click-to-play videos (`<video preload="none">` so heavy MP4s never load until played), each with a **title + one-line overview** (from Elena's descriptions, marked to refine): **USM A.I. Pitch Deck** · **Nintendo Redesign** · **Paige Bueckers × Dave's Hot Wings** (1st place, marketing-class comp). Still Elena's to personalise + polish the overview copy.
- **Achievements = illustrated STICKER SHEET (crossword fully retired, built + heavily polished session 4).** 7 hand-drawn die-cut stickers (`*_sticker.png`) scattered in a loose 4-over-3 layout on a **full-bleed parchment "sheet"**, positions/sizes data-driven from a `pos:{l,t,w,r}` object per sticker in `setupStickerSheet` (l/t = centre %, w = width %, r = rotate). Clicking one opens the popup (`#achievementOverlay`) with that sticker **pinned overhanging** a cream story card + Elena's story + an optional **"learn more" button** (Stellina→`#stellina`, Teacher→`#design-learning`, AI→`#branding`). Popups are **sticker-only, no images** (Elena's call — was inconsistent). `setupCrossword` is inert. **The sheet's look is a hard-won system, don't casually refactor it:**
  - Board is the Fine Art **parchment** colour via a **CSS mask** of `sticker_sheet_needs_backdrop_to_contrast_cream.png` (PNG = shape only, fill = `--color-bg-alt`). Section bg is a **warm-white→parchment vertical gradient** so warm white sits behind the crest (top) and the parchment sheet **connects seamlessly into Fine Art** at the bottom (`.section--achievements` `padding-bottom:0`).
  - **Crest shadow** (makes the same-colour sheet edge read, like white-on-white text): shadow lives on an **outer un-masked `.sheet-shadow` div**, mask on the **inner `.sheet-fill`** — because `mask` + `filter:drop-shadow` on the SAME element makes the mask clip the shadow away (see Traps). `.sheet-shadow` is **`clip-path`-clipped to the top** so the shadow only lands on the crest, never on the Fine-Art seam.
  - Title + intro are grouped in `.archive-header` (no visible box — Elena rejected the box), seated well down in the crest.
- **Design for Learning (rebuilt to Elena's mockup, session 5).** Soft pink-lilac panel (`#F3E7EF`) with **two equal labeled cards + the Stellina character** (`.edu-panel`, 3-col grid, generous padding for breathing room). Card 1 **"Kids Art From Activity"** = the emotion piece (`edu-kidsart-1`) + Elena's blurb. Card 2 **"Social Story"** = the **"velt"** — a VERTICAL auto-scrolling belt of the 3 numbered social-story pages (`edu-social-story-1/2/3`, "Listening and Learning at School") inside a card (`setupStoryBelt` duplicates `#storyBelt` for a seamless `translateY(-50%)` loop, ~50s = slow/calm, hover-pauses). Character sits **bottom-aligned + large** (`align-self:end`, 400px). Each card's blurb is Elena's (one per card — don't re-stack).
- **The Stellina character is a 7-layer CSS RIG (session 5), classes `.rig-*` NOT `.stel-*`** (the Stellina SCENE owns `.stel-layer` — collision breaks both, see Traps). Layers: `stellina_body/head/eyebrows/eyes_open/eyes_closed/mouth_open/mouth_closed.png`, all same 1214×1933 canvas, stacked at `inset:0`. Idle loop: `.rig-head` sways as a unit; the OPEN eyes/mouth (`.rig-active`) fade OUT while the CLOSED (`.rig-rest`) fade in → clean blink + neutral-mouth swap; `.rig-brows` relaxes. All CSS, off under reduced motion. (Head-sway pivot `transform-origin:50% 35%` was a guess — tune if the neck's wrong.)
- **Attribution ★ system (session 5).** A copper footnote-star `.attr-mark` flags work that ISN'T Elena's original illustration: on the **"Kids Art From Activity"** title (children's own artwork) and the **Presentation** decks (non-commercial class projects, found/collaged reference). A **footer legend** (`.attr-legend`, wrapped with the copyright in `.contact-footer-legal` in the Contact soil band) explains it. Legend wording is a `NOTE FOR ELENA` draft — hers to finalise; also verify it doesn't crowd the flowers on her real browser.
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

**Cache-busting / stale serving.** css/js are linked as `css/style.css?v=N` + `js/main.js?v=N`. **Bump N on every css/js change** or the preview — and Elena's deploy — serves stale files. This bit us repeatedly (missing flowers, un-run JS). Current version: **v=90**. (Note: **videos have NO ?v= cache-bust** — replacing an mp4 in place serves the browser-cached old one. Fix: give the new video a NEW filename and update the src. Bit us with the hero clips — see Traps.)

**Footer-outside-`#main` stacking.** To layer the meadow OVER the footer but BELOW the heading text, the clean fix was **merging the footer into the contact section** (making it the last element), not fighting z-index across the `#main`/`<footer>` boundary. Do **not** give `#main` a z-index (caused an earlier bug).

**Big un-optimized PNGs cause scroll jank.** The Stellina layers were multi-MB (blue_sky_8 alone was 2MB). Fix: TinyPNG (same filenames, ~-80% on the PNGs) + don't `will-change`-promote many full-size layers + only run the parallax transform when the scene is near the viewport.

**`mask` + `filter: drop-shadow` on the SAME element = no shadow.** The browser applies the filter, then clips the result with the mask — so the drop-shadow (which lives *outside* the shape) gets clipped to nothing. Cost hours on the sticker sheet ("the shadow isn't rendering at all"). Fix: split them — mask on an inner div, `drop-shadow` on an un-masked outer div wrapping it (see the Achievements `.sheet-shadow`/`.sheet-fill` pair).

**Class-name collisions across sections.** The Stellina character rig (Design for Learning) first used `.stel-layer` — which the Stellina immersive SCENE already owns for its 13 injected parallax layers. My CSS bled onto the scene and the scene's bled onto the rig (could break both). Renamed the rig to `.rig-*`. Before reusing a `.stel-*` (or any generic) class, grep it. **Bit us again (session 6):** the new Fine Art deck used `.deck-card`/`.deck-row` — which the **Presentation pitch decks already own** — so the deck CSS (`width:30%; aspect-ratio:4/3; overflow:hidden`) clamped the pitch-video cards into tiny clipped boxes ("videos got messed up"). Fixed by renaming the Fine Art deck to `fdeck-*`. **ALWAYS `grep -rn '\.classname' css js index.html` before naming a new component class.** Also note: **Elena edits `index.html` directly sometimes** — you'll see "file modified on disk" notices; re-read before edits that depend on surrounding markup.

**Videos have no cache-bust, and replacing an mp4 in place serves the stale cached one.** css/js use `?v=N`; video `src`s do NOT. When you re-encode/replace a video under the same filename, the browser (and Elena's) keeps serving the OLD cached bytes — the `<video>` element's `videoWidth`/`videoHeight` will still report the old dimensions even though a `fetch(...,{cache:'no-store'})` returns the new file. Cost real confusion in session 6 (black "…ENA PARR" = the old hero clip). **Fix: give a replaced video a NEW filename and update the `src`.**

**Large canvas→webp exports: decode from the tool-results FILE, not a pasted string.** To make a webp from a browser `canvas.toDataURL('image/webp')` (used for the doll re-crop, Old San Juan, the trimmed Brainbow), the base64 is huge. Pasting it into a Bash heredoc corrupts it ("Incorrect padding"). Reliable path: make the JS return a payload big enough that the tool auto-saves it to a `tool-results/*.txt` file, then `python3 -c "import json,base64; ...json.load(...)[0]['text']..."` decode from THAT file. Flatten onto white first (`ctx.fillStyle='#fff';fillRect`) if a white card background is wanted.

**Independent-column ("brick") masonry breaks reading order.** The About section is two separate `.about-col` stacks, which is why the bricks don't align in rows — but it also means the DOM (and screen-reader / stacked-mobile order) is *all of left column, then all of right column*, so the bio chapters read 1, 3, 2. **This is a known a11y/mobile debt — fix the interleave in the mobile pass** (left as a NOTE in the markup).

**A section's shadow can bleed onto the NEXT section.** `.section-inner` has `z-index: 2`, which lifts a section's content (incl. any overflowing drop-shadow) ABOVE the following section's background — so the next section does NOT paint over it. A sheet's bottom-edge shadow was landing on the Fine Art seam. Fix used: `clip-path: inset(... bottom ...)` on the shadow layer to discard the shadow below the crest (parchment-on-parchment below the clip = the clip edge is invisible).

**The preview pane collapses `vw` too, not just `vh`.** Full-bleed `100vw` elements (the sticker sheet, film reel) compute to width 0 in the pane and vanish. To screenshot them, temporarily override to a concrete px width in JS. And section/junction shots: hide sibling sections + shrink the target's height inline so the seam fits the ~450–900px capture.

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

**Done (session 3, 2026-08-03):** **Text scheme "C" locked site-wide** (lilac eyebrow / plum title / plum-mauve body) · **nav → plum theme** · **Publications rebuilt as inverted plum gallery** (2-up front covers + CSS lilac offset cards + drop-shadow + Overview block; back cover dropped) · **Achievements split into its own warm-white section** · **hero sketch outline recoloured to plum** (masked div) · **Branding logo band → seamless auto-marquee** · section titles ~120px uniform (fit-to-width tried & reverted) · flamingo wheel bug fixed · **Achievements crossword → illustrated STICKER SHEET built** (7 stickers on a soft-lilac backing; clicking one "pins" it overhanging a cream story card on a lilac backdrop → achievement image + text; `setupStickerSheet` in main.js owns the popup now, `setupCrossword` inert; content mapped w/ Founder→Stellina + CREATE folded into Pitch; **peel animation is the next polish pass, not built yet**; bodies still `NOTE FOR ELENA`). Cache at **v=37**. **Not yet uploaded to GitHub** — all work since v=15 is uncommitted in the clone.

**Done (session 4, 2026-08-03):** **Achievements sticker sheet finished & polished** (parchment masked sheet, warm-white→parchment gradient connecting seamlessly into Fine Art, crest shadow via the two-element `.sheet-shadow`/`.sheet-fill` split + `clip-path`, 4-over-3 sticker layout, grouped `.archive-header`, sticker-only popups + "learn more" buttons) · **all 7 achievement stories written by Elena + slotted in** (titles derived from her words) · **"Publications" → "About"** + 2-col books-left/overview-right layout · **"Branding" → "Presentation"**, **logo belt removed**, 3 decks given titles+overviews · About padding normalised to 128/128 · CD-audit pass (alignment + rhythm confirmed consistent). Cache at **v=60**. **Not yet uploaded to GitHub** — big backlog since v=15 still uncommitted in the clone.

**Done (session 5, 2026-08-04):** **Design for Learning rebuilt to mockup** (two labeled cards "Kids Art From Activity" + "Social Story" · the "velt" = vertical scrolling numbered social-story pages inside a card · larger bottom-aligned Stellina) · **Stellina character rigged + animated** (7-layer CSS rig, sway + clean blink + mouth swap; `.rig-*` classes after a `.stel-layer` collision with the Stellina scene) · **attribution ★ system** (Kids Art + Presentation decks flagged, footer legend) · CD-audit polish carried over. Cache at **v=64**. Still uncommitted.

**Done (session 6, 2026-08-04 — a marathon, v=64 → v=90):**
- **HERO fully reworked.** Videos SCRAPPED (the erase + nice-to-meet-ya clips, archived to `~/Desktop/_archive/`). Now an interactive **"HI, I'M ELENA PARR"** title rebuilt from Elena's own per-letter PNGs (`hi_im.png`, `e_1`…`r_9`, `period.png` — all the SAME 2550×1298 canvas, stacked at `inset:0` to recompose her exact rainbow layout). Each ELENA PARR letter's **hover region is clip-path'd to its glyph** (measured bboxes) so per-letter hover works despite full-canvas overlap; on hover it **zooms ~1.6× and settles ~1.28× (forwards)**. On load it **bubble-pops in one at a time in number order** (WAA `el.animate()`, staggered ~95ms — NOT a persistent CSS animation, so it doesn't re-fire after hover). `.hero-name` is `translateX(-5.33%)` so the visible text left-aligns with the tagline (measured content-left = 5.33%). `setupHeroName` in main.js.
- **Fine Art grid → click-through DECK** (`fdeck-*` classes — do NOT use `deck-*`, the Presentation pitch cards own those; the collision clipped the pitch videos, see Traps). Messy tilted pile, click/arrows/←→ to flip, `object-fit:contain`. Doll re-trimmed (2000² mostly-transparent → tight 750×680 webp). **Wheel**: ghost titles + year under each piece (filenames were SCRAMBLED — verified each painting by eye; added an 8th, "Old San Juan" 2026); overlap fixed by dropping the track-duplication and spacing at `360/count` (fills the circle once), radius `0.42` to sit closer.
- **About rebuilt to Elena's mockup (twice).** Final = tight **2-col "newspaper brick" masonry**: two independent `.about-col` columns (left: para1 · 2 books · Tampa para / right: Buttons comic · MECA para · Brainbow) that pack separately so nothing aligns in rows; body copy `text-align:justify`. Images on **lilac rounded "mat" cards** (`.about-card-media`). Brainbow = **stationary trimmed logo** (`brainbow-logo-tight.webp`, cropped from `brainbow-logo.webp`) capped ~320px + `margin-top:auto` so its title bottom-aligns with the Tampa paragraph. Comic correctly titled **"Buttons the Blue Faced Moon · MECA · 2021"** (mockup mislabeled it; unpublished, made at MECA). Bio = Elena's revised copy.
- **Content (all Elena's words):** revised Presentation blurbs + **site-wide "Dave's Hot Wings" → "Bueckers × Warner Bros" correction** (renamed the video + poster files too). Presentation cards → light-lilac `#F1E6EF` (the Stellina gradient tone), even heights. Footer asterisk → copper `*`; credit reconciled to "Everything else, handmade."
- **Stellina rig:** blink retimed to a quick ~250ms every 5s; **mouth DECOUPLED** from the blink (its own slow 10s `.rig-mouth-*` crossfade).
- **Design for Learning panel** made full-bleed lilac running into Presentation; cards smaller/left-flanked; fixed a latent bug (padding/gap referenced undefined `--sp-5/-7/-9`).
- **PALETTE:** Elena wanted Bubblegum Fizz `#FF58BC` as PRIMARY (replacing plum). Tested on Connect, **REVERTED** — bubblegum is a light colour, flattens titles & competes with the pink already in her art; plum stays the frame (see the `bubblegum-accent-not-primary` memory). Left `#FF58BC` + `#C45A9B` "Fuchsia Plum" documented but the UI has NO added pink.
- **Cleanup:** unused mp4s + big source PNGs archived out of the deploy folder (Elena wants backups OUT of it). Still uncommitted/undeployed.

**Known bugs, queued:** none currently.

**Next up / not built yet (in priority order, end of session 6):**
- **MOBILE PASS — the immediate next task.** Untouched, and the site is desktop-only right now. Elena said she's been keeping notes on what's broken on mobile — ask for them. Known concerns: the new **About "brick" masonry reading order** (two columns group the DOM → chapters read 1,3,2; fix the interleave), the **hero title scale** on small screens, the **sticker sheet** (`vw` sizing + fixed board height), and the **100vh Stellina scene** (crops hard on portrait).
- **THE DEPLOY** — still nothing live; local at **v=90**. A `git push` (real remote exists) or the manual 5-file upload. Do it right after mobile.
- Sticker-sheet **peel animation** (GSAP Flip) — deferred polish; sheet works great without it.
- Stellina rig: optional whole-body breathe; head-sway pivot may want tuning.
- Ambient rainbow-light dormant (`.ambient-light`/`.light-blob` CSS + guarded `setupAmbientLight()`), in case a jewel-palette version is reworked.
- (Old grid film-reel CSS/JS is dead code; the Fine Art still-grid CSS is also now superseded by the deck — leave unless doing a cleanup pass.)

**Content boundary (IMPORTANT):** Elena writes **all** art and **all** copy herself — podcast scripts, educational/social-emotional text, achievement stories, section copy — and it's reviewed by education/behavioral specialists. Claude scaffolds structure/code, organizes/renames assets, and flags brand-consistency drift; use "NOTE FOR ELENA" placeholders, never generate the substance. When existing prior-Claude copy reads off (e.g. an old crossword clue), flag it — don't rewrite it.

**Waiting on Elena (end of session 6):**
- **Mobile notes** — she's been collecting them; needed for the mobile pass.
- Confirm 3 draft caption sub-lines that are still Claude's: **"MECA · 2021"** (Buttons comic), **"Brand identity"** (Brainbow), and the **footer attribution legend** wording.
- Social handles (email set: `elenamaria.parr@gmail.com`; socials pending a third-party aggregator).
- ✅ DONE now (were pending): About bio (her revised copy, in DOM), Presentation deck copy (her words), achievement stories, hero videos (scrapped in favour of the interactive title).
- **THE DEPLOY** — local at v=90; a `git push` or the manual 5-file upload is the only thing between here and a sendable link.

**Bigger picture:** Elena is building a larger business (podcast w/ recorded music + products, newsletter, multi-platform video). Claude can help beyond this site — copy, launch/marketing planning, landing pages, asset organization — but that's a **separate project → separate chat/folder**. Not art or podcast/educational writing (hers).

**Undecided:**
- Whether Stellina Mae needs a dedicated `/stellina` page in addition to its homepage section
- Hero eyebrow line (Portland, Maine + email) above "Hi, I'm Elena," in the style of spencergabor.work — discussed, not built

**Unpolished but functional:**
- **Mobile layouts** — the sticker sheet uses `vw`-based sizing + a fixed board height that will need a portrait pass; the 100vh Stellina scene crops hard on portrait. (Sticker positions are `%`-based so they scale, but the whole section wants a mobile review.)
- Spacing token cleanup — some additions (incl. sticker-sheet gradient stops) use raw values instead of `--sp-*`
