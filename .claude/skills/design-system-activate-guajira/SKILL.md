---
name: design-system-activate-guajira
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards for the Activate Guajira health & fitness platform. Use when creating or updating UI rules, component specifications, or design-system documentation in this repository.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Activate Guajira Design System

## Mission

Activate Guajira is the health, fitness and anthropometric-tracking platform of Universidad de La Guajira. The interface must feel like athletic performance software — fast, confident, data-forward — while staying legible to students, trainers and administrators on low-end phones over slow connections. Every screen answers one question first: *what is my body doing, and what do I do next?* Visual energy comes from decisive typography, deep navy surfaces and a single high-voltage lime accent, never from decoration.

## Brand

- Product/brand: Activate Guajira (Universidad de La Guajira)
- Audience: students tracking their own fitness, trainers (`entrenador`) recording measurements for many people, and system administrators managing roles and resources
- Product surface: responsive web app (Angular), mobile-first, installed as a PWA
- Language: Spanish (es-CO). All UI copy must be Spanish.

## Style Foundations

Visual style: deportivo energético — Caribbean-athletic. Deep navy ground, high-voltage lime accent, condensed uppercase display type, generous card elevation, purposeful motion.

### Color tokens

All color must be consumed through semantic tokens. Raw hex values are forbidden in component styles.

**Ramps** (defined once in the token layer):

| Token | Value | Role |
|---|---|---|
| `--ag-navy-50` | `#F2F6FB` | tinted surface |
| `--ag-navy-100` | `#E1EAF5` | subtle fill |
| `--ag-navy-200` | `#C3D5EA` | border on tinted |
| `--ag-navy-300` | `#93AFD0` | disabled brand text |
| `--ag-navy-400` | `#5C82B0` | muted brand |
| `--ag-navy-500` | `#2F5A8F` | interactive brand |
| `--ag-navy-600` | `#1B3F6D` | hover |
| `--ag-navy-700` | `#12305A` | active |
| `--ag-navy-800` | `#0B1F3A` | **brand primary** |
| `--ag-navy-900` | `#071427` | deepest ground |
| `--ag-lime-100` | `#EDFAC7` | accent wash |
| `--ag-lime-200` | `#DDF694` | accent border |
| `--ag-lime-300` | `#C6F24E` | **brand accent** |
| `--ag-lime-400` | `#ADE02F` | accent hover |
| `--ag-lime-500` | `#8FBF1E` | accent active |
| `--ag-lime-700` | `#4F6B10` | accent text on light |
| `--ag-coral-400` | `#FF5A47` | energy / alert accent |
| `--ag-coral-600` | `#D93A29` | energy hover |

**Neutrals**: `--ag-neutral-0 #FFFFFF`, `50 #F7F9FC`, `100 #EFF3F8`, `200 #E2E8F0`, `300 #CBD5E1`, `400 #94A3B8`, `500 #64748B`, `600 #475569`, `700 #334155`, `800 #1E293B`, `900 #0F172A`.

**Status**: `--ag-success #16A34A`, `--ag-warning #F59E0B`, `--ag-danger #DC2626`, `--ag-info #0EA5E9`, each with a `-soft` background variant at ~12% tint.

**Semantic aliases** — these are what components use:

`--ag-bg-canvas`, `--ag-bg-surface`, `--ag-bg-raised`, `--ag-bg-sunken`, `--ag-bg-inverse`,
`--ag-text-primary`, `--ag-text-secondary`, `--ag-text-muted`, `--ag-text-inverse`, `--ag-text-accent`,
`--ag-border-subtle`, `--ag-border-default`, `--ag-border-strong`, `--ag-border-focus`,
`--ag-action-primary`, `--ag-action-primary-hover`, `--ag-action-accent`, `--ag-action-accent-hover`.

The system ships **light theme only**. Do not author `prefers-color-scheme` overrides; a future dark theme must be added by redefining the semantic aliases, never by patching components.

### Typography scale

Two families, loaded with explicit fallbacks:

- Display: `'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif` — weights 600/700. Used for headings, stat values, and buttons. Uppercase with `letter-spacing: 0.02em` for H1–H3 and buttons.
- Body/UI: `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` — weights 400/500/600. Never uppercase.
- Numeric data must set `font-variant-numeric: tabular-nums` so columns align.

| Token | Size / line-height | Use |
|---|---|---|
| `--ag-text-display` | 48px / 1.05 | hero and landing headline |
| `--ag-text-h1` | 34px / 1.15 | page title |
| `--ag-text-h2` | 26px / 1.2 | section title |
| `--ag-text-h3` | 20px / 1.3 | card title |
| `--ag-text-body-lg` | 17px / 1.55 | lead paragraph |
| `--ag-text-body` | 15px / 1.55 | default |
| `--ag-text-sm` | 13px / 1.5 | secondary, table cells |
| `--ag-text-xs` | 11px / 1.4 | labels, badges, overline |
| `--ag-text-stat` | 40px / 1 | KPI value |

Display sizes must clamp down on small viewports; use `clamp()` rather than a media-query cascade.

### Spacing scale

4px base: `--ag-space-1 4px`, `-2 8px`, `-3 12px`, `-4 16px`, `-5 20px`, `-6 24px`, `-8 32px`, `-10 40px`, `-12 48px`, `-16 64px`, `-20 80px`. No value outside this scale may appear in component CSS.

### Radius, shadow and motion tokens

- Radius: `--ag-radius-sm 6px`, `-md 10px`, `-lg 16px`, `-xl 24px`, `-full 999px`.
- Shadow: `--ag-shadow-xs`, `-sm`, `-md`, `-lg`, `-xl` — all navy-tinted (`rgba(11,31,58,·)`), never neutral black. Plus `--ag-shadow-accent` for a lime glow on primary CTAs only.
- Motion: `--ag-dur-fast 120ms`, `--ag-dur-base 200ms`, `--ag-dur-slow 320ms`. Easing `--ag-ease-standard cubic-bezier(0.4, 0, 0.2, 1)` and `--ag-ease-spring cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Layout: `--ag-sidebar-w 264px`, `--ag-sidebar-w-collapsed 76px`, `--ag-topbar-h 64px`, `--ag-content-max 1440px`.

## Accessibility

- Target: WCAG 2.2 AA.
- Body text must reach 4.5:1 against its background; text ≥24px or ≥19px bold must reach 3:1.
- **Lime `#C6F24E` must never carry text color on a light background** — it fails contrast. Use it as a fill behind navy text, as a border, or as `--ag-lime-700` for accent text.
- Keyboard-first interactions are required. Every interactive element must be reachable by Tab in DOM order and operable with Enter/Space.
- `:focus-visible` must render a 2px `--ag-border-focus` ring with a 2px offset. Removing outlines without a replacement ring is prohibited.
- Any `(click)` on a non-button element must also carry `tabindex="0"`, a `role`, and a keyboard handler — or be converted to a real `<button>`. Converting is preferred.
- Icon-only controls must carry `aria-label` and a tooltip.
- Data conveyed by color (IMC / ICC / body-fat classification) must also be conveyed by text or icon.
- Respect `prefers-reduced-motion: reduce` by collapsing all transitions and animations to near-zero duration.
- Minimum touch target 44×44px.

## Writing Tone

Concise, confident, implementation-focused. Spanish, second person singular ("tu progreso", "registra tu medición"). Action labels are imperative verbs. No exclamation marks in system messages. Never blame the user in errors; state what happened and the next step.

## Rules: Do

- Use semantic tokens, not raw hex values, in component guidance and component CSS.
- Define all required states: default, hover, focus-visible, active, disabled, loading, error, empty.
- Specify responsive behavior and edge-case handling for every component.
- Give every data view an explicit empty state, loading skeleton and error state.
- Use `<button>` for actions and `<a>` for navigation.
- Keep tables horizontally scrollable inside their own container so the page body never scrolls sideways.
- Animate `transform` and `opacity` only.

## Rules: Don't

- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions ("Aceptar" alone, "Click aquí").
- Do not write inline `style="…"` in templates; move it to the component stylesheet using tokens.
- Do not use `::ng-deep` without scoping it to the host component.
- Do not load fonts, scripts or stylesheets from inside a component template.
- Do not animate `width`, `height`, `top` or `left`.
- Do not use spinners where a skeleton communicates layout better.

## Guideline Authoring Workflow

1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure

- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations

Every component spec must include keyboard, pointer and touch behavior; the spacing and typography tokens it consumes; and its long-content, overflow and empty-state handling.

### App shell

Fixed left sidebar at `--ag-sidebar-w` on `≥1024px`, collapsing to `--ag-sidebar-w-collapsed` icon rail on `≥768px`, and to an off-canvas drawer below `768px`. The sidebar ground is `--ag-navy-800`; the active item is marked by a lime left bar plus a raised navy fill, never by color alone. Topbar is `--ag-topbar-h`, sticky, `--ag-bg-surface` with `--ag-border-subtle` beneath it. Content column is centered, capped at `--ag-content-max`, padded `--ag-space-6` (mobile `--ag-space-4`).

### Card

`--ag-bg-surface`, `--ag-radius-lg`, `--ag-border-subtle`, `--ag-shadow-sm`. Hover on interactive cards only: `translateY(-2px)` and `--ag-shadow-md` over `--ag-dur-base`. Header/body/footer separated by `--ag-space-4`. Cards must never nest more than one level.

### Stat tile

Overline label in `--ag-text-xs` uppercase `--ag-text-muted`; value in display font at `--ag-text-stat` with tabular numerals; delta chip with directional icon and text sign; optional sparkline. The tile states its unit explicitly. On no data, show `—` and the caption "Sin registros".

### Button

Variants: `primary` (navy fill, white text), `accent` (lime fill, navy-900 text, `--ag-shadow-accent`), `outline` (transparent, `--ag-border-strong`), `ghost` (transparent, no border), `danger`. Sizes `sm 32px`, `md 40px`, `lg 48px`. Display font, uppercase, `letter-spacing: 0.04em`. Loading state swaps the label for a spinner but preserves the button's width. Disabled uses `--ag-neutral-200` fill and `--ag-neutral-400` text and must not rely on opacity alone.

### Form field

Label above the control in `--ag-text-sm` weight 500. Control height 44px, `--ag-radius-md`, `--ag-border-default`. Focus: `--ag-border-focus` plus 3px navy-tinted ring. Error: `--ag-danger` border with a message below carrying an icon and `aria-describedby`. Help text sits below the label, above the control. Required fields are marked with a text "obligatorio" affordance, not only an asterisk.

### Data table

Sticky header with `--ag-bg-sunken` fill, `--ag-text-xs` uppercase labels. Rows separated by `--ag-border-subtle`; hover fill `--ag-navy-50`. Numeric columns right-aligned with tabular numerals. Actions live in a trailing column of icon buttons with `aria-label`. Below `768px` the table becomes a stacked card list — one card per record with label/value pairs — rather than a horizontal scroll. Long text truncates with an accessible tooltip. Empty state renders an illustration slot, a one-line explanation and the primary action.

### Health classification badge

IMC, ICC and body-fat values render as a pill combining a status color, an icon and the classification word ("Normal", "Sobrepeso"). Never color-only. Clicking opens the explanation dialog.

### Dialog

`--ag-radius-xl`, `--ag-shadow-xl`, max-width `560px` for forms and `960px` for data. It must have a visible title, a labelled close control, focus trapped inside, focus returned to the trigger on close, and dismissal on Escape. Destructive confirmations name the object being destroyed and use the `danger` button variant.

### Toast

Top-center, `--ag-radius-lg`, status-colored left bar, icon, title, optional body. Auto-dismiss 5s for success/info; errors persist until dismissed. Toasts must never be the only place a validation error appears.

## Quality Gates

- Every non-negotiable rule uses "must".
- Every recommendation uses "should".
- Every accessibility rule is testable in implementation.
- Prefer system consistency over local visual exceptions.

## QA Checklist

- [ ] No raw hex, rgb or named colors in component stylesheets — tokens only.
- [ ] No inline `style` attributes in templates.
- [ ] Every interactive element has a visible `:focus-visible` ring.
- [ ] Contrast verified for text, borders and icons at AA.
- [ ] Every list/table has loading, empty and error states.
- [ ] Keyboard-only pass completes every primary flow.
- [ ] Layout verified at 360px, 768px, 1024px and 1440px.
- [ ] No horizontal page scroll at any breakpoint.
- [ ] `prefers-reduced-motion` honored.
- [ ] Spanish copy reviewed for tone and accents.
- [ ] `ng build` completes with no new warnings.

<!-- TYPEUI_SH_MANAGED_END -->
