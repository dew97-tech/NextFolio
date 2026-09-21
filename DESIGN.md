# DESIGN

Design system for the portfolio. Every component and page must follow this file. If a value is missing here, add it here first, then use it.

## Design read

Reading this as: developer portfolio for hiring managers and engineering leads, with an editorial newsprint language, leaning toward Tailwind v4 + native CSS + Newsreader and Geist.

Dials: DESIGN_VARIANCE 5, MOTION_INTENSITY 2, VISUAL_DENSITY 4. Deliberately quieter than the portfolio default. The record of work carries the site; the interface recedes.

## Palette: newsprint and ink

Neutral paper, neutral ink, no beige, no hue in the chrome. Color is a scarce resource. The public site uses zero accent hue: actions are ink, links are ink with an underline, focus is ink. The only color on the site lives in admin status text and code blocks.

Light:

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F4F4F1` | page background |
| `--surface` | `#FCFCFA` | raised surfaces, inputs |
| `--ink` | `#1A1B18` | text, actions |
| `--ink-muted` | `#4F514A` | secondary text |
| `--ink-faint` | `#63655E` | metadata, captions |
| `--rule` | `#E2E2DC` | hairlines, input borders |
| `--rule-strong` | `#CFCFC7` | emphasised dividers |
| `--focus` | `#1A1B18` | focus ring |
| `--code-bg` | `#ECECE6` | inline and block code |
| `--ok` | `#3D6B4A` | admin only: published |
| `--warn` | `#7A5B18` | admin only: draft, pending |
| `--danger` | `#8A3B32` | destructive actions |

Dark:

| Token | Value |
| --- | --- |
| `--paper` | `#141512` |
| `--surface` | `#1B1C18` |
| `--ink` | `#EBECE5` |
| `--ink-muted` | `#A2A49A` |
| `--ink-faint` | `#94968A` |
| `--rule` | `#2B2C27` |
| `--rule-strong` | `#3C3D36` |
| `--focus` | `#EBECE5` |
| `--code-bg` | `#20211C` |
| `--ok` | `#7FB08D` |
| `--warn` | `#C7A75B` |
| `--danger` | `#D08A80` |

Rules:
- Never pure black or pure white.
- Do not mix warm and cool grays. This palette is neutral with a faint green cast on both themes.
- One palette per page. Admin may use `--ok`, `--warn`, `--danger`; the public site may not.
- Contrast: body text at least 4.5:1 in both themes.
- The only decorative color on the public site is the Codecademy yellow used for text selection (`rgba(255, 211, 0, 0.30)` in both themes) and the highlighter marker. Light marker: `0.5` fill. Dark marker: a `0.14` to `0.30` fill gradient plus a `0.55` bottom bar. Highlighted words switch to `--ink` because muted text on the dark fill fails AA. It is never used for text, borders, or surfaces. Every text token still passes AA while selected or highlighted.

## Type

| Role | Family | Weight | Notes |
| --- | --- | --- | --- |
| Display (name, section titles) | Newsreader | 400 | line-height 1.05, letter-spacing -0.02em |
| Body and UI | Geist Sans | 400, 500, 600 | 17px, line-height 1.65 |
| Metadata, dates, tags, code | Geist Mono | 400, 500 | 13px, letter-spacing 0.01em, tabular-nums |

Scale:
- Name: `clamp(2.75rem, 6.5vw, 5.25rem)`.
- Section title: `clamp(1.75rem, 3vw, 2.25rem)`.
- Entry title: 1.25rem, Geist 600.
- Body: 1.0625rem (17px), max measure 65ch.
- Small: 0.875rem. Meta: 0.8125rem.

Rules:
- No all-caps labels. No tracked-out eyebrows above section headings. Section headings stand alone, sentence case.
- Italic accents only from the same family and only when the words carry it. If an italic display word has a descender, line-height 1.1 minimum.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body.
- No serif for UI, buttons, or data.

## Shape

One radius system, documented:

| Element | Radius |
| --- | --- |
| Controls (buttons, inputs, selects) | 4px |
| Surfaces (cards, media, code blocks, panels) | 8px |
| Status chips | 4px |
| Avatars | 4px |
| Status dots | full |

No pills for buttons, tags, or badges. No 16px-plus radii on cards. Hairline borders only; no shadows except a single `0 1px 2px rgb(20 21 18 / 0.04)` on the sticky header when scrolled, or none at all.

## Layout

- Container: max-width 1180px, gutters 20px mobile, 32px tablet, 40px desktop.
- Grid: 12 column CSS grid for asymmetric sections; strict single column under 768px.
- Section rhythm: `padding-block: 5rem` mobile, `7rem` desktop. Optically more space above a section title than below it.
- Rules organise content: a rule above a group, not under every row. Never top and bottom borders on every list item.
- Projects: editorial rows, asymmetric (title and meta left, detail right at lg). Alternate offset. No three equal cards.
- Experience: company blocks separated by a rule and space, not a per-bullet timeline.
- Long lists over five items: group into clusters with headings, or split columns.
- Paper bands: sections alternate `paper` and `surface` (`band-paper` / `band-surface`). Projects and Skills sit on paper, Experience and Awards on surface. The band is the only thing that changes between sections; type, rules, and spacing stay identical.
- Folios: each home section carries a mono folio (`01 / 04` through `04 / 04`) on its top rule, right-aligned to the container, sitting in a chip of the band color so it interrupts the hairline. `aria-hidden`. Project rows carry mono row numbers (`01` onward) above the title.
- Project rows are a ledger: one hairline above each row, row number, then title. No per-row bottom border.
- Hero: max four text elements (name, role line, intro under 20 words, actions). Top padding max `pt-24`. No scroll cue, no badge, no availability dot, no facts strip.
- Navigation: one line at desktop, height 64px, hairline bottom border, page background.

## Motion

- Hero load sequence: one orchestrated moment. Name, role line, intro, and actions rise 8px and fade over 420ms with 70ms stagger. Runs once on load, gated behind `scripting: enabled` and `prefers-reduced-motion: no-preference`.
- Typed line: three places only, never loops and never deletes. The hero role line types on mount with a caret. The `Selected work`, `Experience`, `Skills`, and `Awards` headings type when 60 percent in view at 28ms per character, with no caret. A heading resets to pending once it has fully left the viewport, so it types again on re-entry. Clicking a section nav link restarts the visible heading after a 200ms beat; jumps to off-screen sections let the scroll entry trigger the type. The Experience total follows its heading by 450ms and keeps the caret. Screen readers get the static text, reduced motion and no-JS get it instantly, and the reserved grid slot prevents any shift.
- Highlighter marker: a rotated, uneven-edged stroke behind key words only. Placements are the hero phrases "Next.js and Laravel" and "AI-assisted automation", `4+ years` in the Experience metric, one real outcome per project row (the `highlight` field in the resume data), and `mark` elements inside articles. The stroke sweeps left to right over 380ms when typed, revealed with a row, or loaded in the hero; the hero pair staggers by 200ms. It sits static under reduced motion and without JS.
- Scroll reveals: one pattern only. Opacity 0 to 1 plus translateY(8px) to 0, 500ms, `cubic-bezier(0.23, 1, 0.32, 1)`, once per element, IntersectionObserver. Grids may stagger children by 60ms with `.reveal-stagger`. Skill chips assemble in sequence at 30ms intervals once their section reveals. Project and Experience bullets rise 4px and fade at 30ms intervals with `.row-seq` once their row reveals. Nothing else animates on scroll.
- Navigation state: the nav link for the section crossing the upper third of the viewport gets the `.link-draw` underline and `aria-current="location"`. The running head follows the same state.
- Running head: the active section name in mono, ink-faint, centered in the header on `lg` and up, `aria-hidden` because the nav already carries the information. Fades over 150ms, empty above the first section.
- Section rules: the 1px rule above each home section draws left to right on entry with a scroll-driven animation, falling back to the static rule where unsupported.
- Reading progress: a 2px ink bar driven by a scroll timeline on every public page.
- Underline draw: single-line links (`.link-draw`) draw a 1px underline over 180ms on hover and keyboard focus. Body-copy links keep a static underline.
- Back to top: text link with the underline draw; its arrow lifts 2px over 150ms on hover and keyboard focus.
- Interaction: `transition: color, background-color, border-color, opacity, transform` at 150ms to 200ms. Explicit properties, never `transition: all`.
- Press feedback: `scale(0.98)` on `:active` for buttons and links with a surface.
- Hover effects only inside `@media (hover: hover) and (pointer: fine)`.
- No other infinite animations, no loop decorations, no cursor effects, no parallax, no tilt, no magnetic movement, no page transitions. The caret blink while typing is the only allowed loop and it stops when typing ends.
- `prefers-reduced-motion: reduce` removes all transforms and leaves instant state changes.
- Only `transform` and `opacity` animate. No layout properties.
- Texture: one fixed, pointer-events-none grain layer on `body::after` at 0.02 opacity (0.03 in dark mode), disabled for print.

## Components

- Buttons: solid ink (primary, one per view), outline (secondary), text link (tertiary). Labels are verbs, one line at desktop, sentence case. Max two actions in one view with different intent.
- Links in body copy: ink, underline with 3px offset, hover reduces underline contrast or thickens by 1px.
- Inputs: surface background, 1px rule border, 4px radius, label above, error text below, focus ring 2px ink offset 2px.
- Cards: only when elevation communicates hierarchy. Prefer grouping with space and one rule.
- Tags: mono, 13px, 4px radius, rule border, transparent background. No color except admin status.
- Theme toggle: two states only, Light and Dark. The first visit follows the operating system, and the first click pins the choice.
- Skill chips: sans 13px, 4px radius, rule border, transparent background, no hover state because they are not interactive. Grouped under a label in a 3/9 grid.
- Skeletons: match final layout shape, paper-to-surface pulse at low contrast.
- Empty and error states: plain functional sentence, an action if one exists.
- Colophon: one rule row above the footer. Left, mono size small: `End of record`. Right: the back to top link. No type credits, no invented credits, no version strings.
- Highlights: one per project row at most, and only phrases that carry a real outcome or differentiator. Never highlight technology names just because they are listed elsewhere.
- Experience metric: the total is a union of role intervals, never a sum, because roles overlap (technoPLUS overlaps JB Connect). Counting is inclusive of both endpoint months. The heading shows the floor ("4+ years") and each company row shows its exact duration.

## Copy

- Plain, specific, active voice. Sentence case everywhere, including buttons and headings.
- Banned words: elevate, seamless, unleash, next-gen, game-changer, robust, delve, journey, dive, deep dive, passion, craft (as filler), cutting-edge, empower, leverage, landscape, supercharge.
- No em dash, no en dash separator, no ellipsis in headings or body copy. The single character ellipsis is allowed in input placeholders and pending labels ("Saving…"). Long dashes are normalized on write in admin actions and in the AI generator; the strip script cleans existing posts. Spaced long dashes become commas, unspaced ones become hyphens.
- No invented numbers, no fake precision, no mock metrics.
- Dates: `Oct 2024 - Present` with a spaced hyphen. Ranges: `2018 - 2022`.
- Errors state what happened and what to do. No apologies, no "Oops".

## Assets

Real images only. No div-built fake screenshots, no hand-rolled decorative SVG, no random stock photography on a personal record. Project rows accept an optional real screenshot; until real screenshots exist the rows stand on typography alone. The owner supplies: one portrait or desk photo for the about area, and screenshots of BridgeBooks and eduKET if they should appear.
