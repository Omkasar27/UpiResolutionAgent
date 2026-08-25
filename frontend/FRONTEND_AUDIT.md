# Frontend Quality Audit

Audit date: 2026-08-25

Scope: `frontend/src`, `frontend/package.json`, production build output, and a live Vite render at phone and desktop viewport sizes. This is an audit only; no application code was changed.

## Anti-Patterns Verdict

**Fail: the interface currently reads as AI-generated in several recognizable ways.** The strongest tells are the near-monochrome slate/indigo dark palette, repeated rounded bordered cards, decorative blurred glow orbs, a gradient-text CTA heading, generic dashboard card/table treatments, and many 28-40px controls. The visual direction is coherent, but it leans on familiar template effects more than on a distinctive payment-resolution visual language. The landing page also uses a three-column repeated feature grid and a full-screen decorative lamp section, both of which reduce information hierarchy.

## Executive Summary

- **16 findings:** 4 high, 8 medium, 4 low.
- **Critical:** 0 confirmed. Core routes render and the production build completes.
- **High:** keyboard/accessibility gaps in navigation and command palette, insufficient form semantics, and frontend lint failure.
- **Medium:** systemic contrast debt, undersized controls, mobile/nav responsiveness risk, unoptimized hero media, and missing request lifecycle/error states.
- **Quality score:** **5.5/10**. The visual system is consistent and the primary workflow is understandable, but accessibility and engineering hygiene are below production readiness.
- **Top priorities:** fix semantic interaction and focus management, make form controls accessible, then raise contrast and remove lint errors before visual refinement.

## Detailed Findings

### High Severity

#### H1. Interactive table rows are not keyboard-operable

- **Location:** [AdminPage.jsx](src/pages/AdminPage.jsx#L204)
- **Severity / category:** High / Accessibility
- **Description:** Each `motion.tr` receives `onClick` and changes the selected dispute, but a table row is not focusable and has no keyboard handler, role, or accessible name. Keyboard and screen-reader users cannot open the detail panel.
- **Impact:** The main admin review workflow is mouse-dependent; the override actions are available, but selecting a dispute is not.
- **WCAG/standard:** WCAG 2.1.1 Keyboard; 4.1.2 Name, Role, Value.
- **Recommendation:** Make the row interaction a real button/link pattern, or add a dedicated “View details” button in its own cell. Preserve table semantics and provide `aria-expanded`/`aria-controls` for the disclosure.
- **Suggested command:** `/harden`

#### H2. Mobile navigation toggle is an icon, not a control

- **Location:** [resizable-navbar.jsx](src/components/ui/resizable-navbar.jsx#L151)
- **Severity / category:** High / Accessibility, Responsive
- **Description:** `MobileNavToggle` renders `Menu` or `X` SVG components with `onClick` directly. There is no `<button>`, focus target, accessible label, or `aria-expanded` state.
- **Impact:** Keyboard users cannot reach or activate the mobile menu, and assistive technology receives no navigation state. The live mobile render confirms the header is the primary navigation surface at narrow widths.
- **WCAG/standard:** WCAG 2.1.1 Keyboard; 4.1.2 Name, Role, Value; target-size guidance in WCAG 2.2.5.
- **Recommendation:** Wrap the icon in a 44px button with `aria-label`, `aria-expanded`, and `aria-controls`; move the click handler to the button.
- **Suggested command:** `/harden`

#### H3. Form labels are not associated with their controls

- **Location:** [Input.jsx](src/components/ui/Input.jsx#L3)
- **Severity / category:** High / Accessibility
- **Description:** `Input` and `Textarea` render a `<label>` but do not generate or forward an `id`, and the label has no `htmlFor`. The customer form therefore lacks a programmatic label relationship.
- **Impact:** Screen readers may announce the transaction and description fields without their visible labels; clicking the label does not focus the control.
- **WCAG/standard:** WCAG 1.3.1 Info and Relationships; 3.3.2 Labels or Instructions.
- **Recommendation:** Generate stable IDs or require an `id` prop, forward it to the control, and set `htmlFor`. Add `aria-invalid` and `aria-describedby` when errors/hints are present.
- **Suggested command:** `/harden`

#### H4. Lint is failing across application code

- **Location:** [App.jsx](src/App.jsx#L1), [AuthContext.jsx](src/context/AuthContext.jsx#L16), [AdminPage.jsx](src/pages/AdminPage.jsx#L33), [CustomerPage.jsx](src/pages/CustomerPage.jsx#L33), [NotFoundPage.jsx](src/pages/NotFoundPage.jsx#L68), [vite.config.js](vite.config.js#L13)
- **Severity / category:** High / Performance, Maintainability
- **Description:** `npm run lint` exits non-zero with 11 errors and 2 warnings: unused imports/variables, set-state-in-effect, stale/missing hook dependencies, functions accessed before declaration, impure `Math.random()` during render, and `__dirname` undefined under ESM linting.
- **Impact:** CI cannot enforce quality; hook lifecycle bugs and unstable render output can ship unnoticed. The `Math.random()` issue causes the 404 decoration to change on every render.
- **Recommendation:** Resolve all lint errors, especially hook dependencies/lifecycles and the ESM path issue; make decorative values deterministic.
- **Suggested command:** `/normalize`

### Medium Severity

#### M1. Systemic low-contrast text tokens

- **Location:** [index.css](src/index.css#L24), [token.js](src/design/token.js#L35), representative use in [CustomerPage.jsx](src/pages/CustomerPage.jsx#L271)
- **Severity / category:** Medium / Accessibility, Theming
- **Description:** `text-slate-600` and `text-slate-700` are used for labels, helper text, metadata, empty states, table headers, and status context on `bg-slate-950`/`bg-slate-900`. These are roughly 2-3:1 in common cases, well below 4.5:1 for normal text. `text-slate-500` is borderline and should not carry essential small text without measurement.
- **Impact:** Important transaction metadata and status context are difficult to read, especially for low-vision users and in bright ambient light.
- **WCAG/standard:** WCAG 1.4.3 Contrast (Minimum); 1.4.11 Non-text Contrast for state indicators.
- **Recommendation:** Measure actual rendered pairs with an automated contrast check, promote essential metadata to a compliant neutral, and reserve muted tones for decorative text only.
- **Suggested command:** `/normalize`

#### M2. Control sizes are below recommended touch targets

- **Location:** [Button.jsx](src/components/ui/Button.jsx#L22), [AdminPage.jsx](src/pages/AdminPage.jsx#L145), [CommandPalette.jsx](src/components/CommandPalette.jsx#L135)
- **Severity / category:** Medium / Responsive, Accessibility
- **Description:** Shared `sm` buttons are 28px high, filters are 28px, action buttons are 24px, and the palette launcher is 32px. The live render measured visible landing buttons at 40px, still below the 44px target recommended for touch comfort.
- **Impact:** Mobile users have small hit areas and a higher risk of tapping adjacent actions, which is particularly consequential for refund/wait/escalate controls.
- **WCAG/standard:** WCAG 2.2.5 Target Size (Enhanced) is not universally required here, but 44px is the practical mobile target; WCAG 2.5.8 Target Size (Minimum) should be considered.
- **Recommendation:** Keep compact visual styling with at least 44px hit-area wrappers; give destructive or financial actions more separation and ensure adjacent targets have sufficient spacing.
- **Suggested command:** `/harden`

#### M3. Command palette lacks focus trapping and focus restoration

- **Location:** [CommandPalette.jsx](src/components/CommandPalette.jsx#L135)
- **Severity / category:** Medium / Accessibility
- **Description:** The dialog autofocuses through `setTimeout`, but there is no focus trap, no restoration to the launcher, no `aria-labelledby`, and no explicit handling for focus leaving the modal. The backdrop is clickable but not otherwise part of a complete dialog interaction model.
- **Impact:** Keyboard users can tab behind the modal and lose their place; screen-reader users get only a generic aria label and no structured result/list relationship.
- **WCAG/standard:** WCAG 2.4.3 Focus Order; 2.4.7 Focus Visible; ARIA dialog pattern.
- **Recommendation:** Use a dialog primitive or implement focus containment, initial focus, return focus, labelled-by semantics, and a live result count/status.
- **Suggested command:** `/harden`

#### M4. Desktop navbar has a hard 800px minimum width

- **Location:** [resizable-navbar.jsx](src/components/ui/resizable-navbar.jsx#L38)
- **Severity / category:** Medium / Responsive
- **Description:** `NavBody` applies `style={{ minWidth: "800px" }}` even though it is inside a responsive component. At intermediate widths the desktop nav can exceed its available space before the `lg` breakpoint takes over.
- **Impact:** Navigation can clip or force overflow on small laptops and zoomed layouts. The current live checks found no body overflow at tested sizes, but the hard constraint remains a fragile breakpoint assumption.
- **Recommendation:** Remove the fixed minimum, use intrinsic flex sizing, and test at 200% zoom and widths between 800-1024 CSS pixels.
- **Suggested command:** `/harden`

#### M5. Hero parallax loads large media eagerly

- **Location:** [hero-parallax.jsx](src/components/ui/hero-parallax.jsx#L66)
- **Severity / category:** Medium / Performance
- **Description:** Up to 15 product images are rendered at 800×640 with no `loading="lazy"`, responsive `srcSet`, or decoding strategy. The container is 300vh and many images are initially outside the viewport.
- **Impact:** Landing-page bandwidth and Largest Contentful Paint can suffer, especially on mobile networks; the parallax section also adds substantial scroll work.
- **Recommendation:** Lazy-load below-the-fold images, provide appropriately sized responsive sources, set `decoding="async"`, and measure LCP/CLS on a throttled mobile profile.
- **Suggested command:** `/optimize`

#### M6. No request cancellation or stale-response protection

- **Location:** [AdminPage.jsx](src/pages/AdminPage.jsx#L31), [CustomerPage.jsx](src/pages/CustomerPage.jsx#L31)
- **Severity / category:** Medium / Performance, Reliability
- **Description:** Admin polling runs every 15 seconds and both pages update state after async requests without an abort signal or mounted/request identity guard. Customer submission can also trigger a history refresh while the component may be leaving.
- **Impact:** Unmount warnings, stale results, unnecessary network traffic, and race conditions around loading state are possible during navigation or slow API responses.
- **Recommendation:** Use `AbortController`, cancel on cleanup, pause polling when hidden, and separate initial loading from refresh state.
- **Suggested command:** `/optimize`

#### M7. Errors are not exposed as persistent, accessible status UI

- **Location:** [AdminPage.jsx](src/pages/AdminPage.jsx#L50), [CustomerPage.jsx](src/pages/CustomerPage.jsx#L47)
- **Severity / category:** Medium / Accessibility, Reliability
- **Description:** Admin fetch failures only call `console.error`; override failures use `alert`; customer errors are rendered without a visible `role="alert"` or focus management.
- **Impact:** Users may not know the dashboard is stale or an override failed, while alert dialogs interrupt flow and are inconsistent across assistive technologies.
- **WCAG/standard:** WCAG 4.1.3 Status Messages; 3.3.1 Error Identification.
- **Recommendation:** Render an inline error/status region with `role="status"` or `role="alert"` as appropriate, provide retry, and announce mutation completion/failure.
- **Suggested command:** `/harden`

#### M8. Theme tokens are disconnected from actual component styling

- **Location:** [token.js](src/design/token.js#L1), [index.css](src/index.css#L10)
- **Severity / category:** Medium / Theming
- **Description:** A token module exists, but most components hard-code Tailwind color classes and raw rgba values. The comments claim an accent swap through indigo remapping, while the token file still calls those tokens indigo and the CSS theme remaps them to blue.
- **Impact:** Theme changes require broad markup edits, can produce inconsistent colors, and make contrast auditing difficult. There is also no actual light-theme variant despite reusable token-like abstractions.
- **Recommendation:** Establish one source of truth using CSS custom properties or a typed class-token layer, document the intentional always-dark constraint, and audit all semantic status colors together.
- **Suggested command:** `/normalize`

### Low Severity

#### L1. Duplicate and unused dependency surface

- **Location:** [package.json](package.json#L11)
- **Severity / category:** Low / Performance
- **Description:** `framer-motion` is used, but `motion`, `gsap`, and `lucide-react` imports were not found in `src`. The bundle is 510.02 KB minified / 160.58 KB gzip and Vite warns about the 500 KB chunk threshold.
- **Impact:** Unused packages increase install complexity and can encourage accidental duplicate libraries; the large single chunk delays startup on slower devices.
- **Recommendation:** Remove unused direct dependencies after confirming they are not required by future patches, and code-split public/authenticated routes or heavy visual sections.
- **Suggested command:** `/optimize`

#### L2. Motion policy is inconsistent with the stated reduced-motion intent

- **Location:** [index.css](src/index.css#L116), [LandingPage.jsx](src/pages/LandingPage.jsx#L52)
- **Severity / category:** Low / Accessibility, Performance
- **Description:** CSS disables only the `.shine-border` animation under `prefers-reduced-motion`; Framer Motion animations across the landing page and dashboards do not consistently use `useReducedMotion` or equivalent reduced transitions.
- **Impact:** Users who request reduced motion may still receive repeated ambient animation, parallax movement, and entrance transitions.
- **Recommendation:** Gate continuous and large-distance motion with Framer Motion’s reduced-motion support and keep opacity-only feedback where possible.
- **Suggested command:** `/harden`

#### L3. Decorative SVGs and logos lack a consistent accessible strategy

- **Location:** [Sidebar.jsx](src/components/Sidebar.jsx#L52), [CommandPalette.jsx](src/components/CommandPalette.jsx#L5)
- **Severity / category:** Low / Accessibility
- **Description:** Icons are inline SVGs without `aria-hidden="true"` or titles. Most are adjacent to text and probably harmless, but the pattern is inconsistent and custom SVGs are used despite `lucide-react` being installed.
- **Impact:** Screen readers may encounter redundant unlabeled graphics; maintenance and icon consistency suffer.
- **Recommendation:** Mark decorative icons hidden, label standalone icons, and use the existing icon library through semantic buttons.
- **Suggested command:** `/normalize`

#### L4. Landing-page copy and composition repeat familiar template cues

- **Location:** [LandingPage.jsx](src/pages/LandingPage.jsx#L203), [LandingPage.jsx](src/pages/LandingPage.jsx#L294)
- **Severity / category:** Low / Theming, UX
- **Description:** Repeated equal cards, `//` pseudo-code labels, ambient glows, a gradient-text CTA, and a generic “three steps” section dominate the visual vocabulary. The tone is consistent but not yet distinctive to UPI dispute operations.
- **Impact:** The public-facing experience feels less credible and memorable than the product’s high-trust domain warrants; decorative content competes with the core workflow.
- **Recommendation:** Replace generic decorative sections with real dispute artifacts: verification timelines, decision evidence, masked transaction states, and a clearer trust hierarchy.
- **Suggested command:** `/normalize`

## Patterns & Systemic Issues

- **Contrast debt:** faint `slate-600/700` text is used across nearly every page for labels, metadata, hints, empty states, and table headings.
- **Touch-target debt:** compact 24-32px actions recur in shared buttons, filters, nav, palette launcher, and override controls.
- **Semantic interaction debt:** clickable rows, icon-only navigation, and modal behavior are implemented with visual components rather than complete keyboard semantics.
- **Token drift:** `design/token.js`, Tailwind classes, raw rgba animation values, and CSS theme overrides coexist without a single semantic color contract.
- **Motion drift:** reduced-motion support covers one CSS animation but not the Framer Motion surfaces that animate continuously or over large distances.
- **Engineering hygiene:** no frontend test script or automated accessibility/contrast check is present; lint is currently red.

## Positive Findings

- The production build completes successfully and the tested phone/desktop renders had no horizontal body overflow.
- Public and authenticated route boundaries are clearly separated in [App.jsx](src/App.jsx#L14), with role-gated admin routing.
- The customer transaction field has visible labeling, a required-field message, and a useful error path; the missing programmatic association is fixable without redesigning the workflow.
- The product uses semantic landmarks in several places (`header`, `main`, `nav`, `footer`) and provides meaningful image `alt` text for parallax product images.
- Animations primarily use opacity and transform rather than animating layout properties. Existing `prefers-reduced-motion` handling and `:focus-visible` styling are good foundations.
- The admin data table includes an overflow wrapper and the live viewport check showed no overflow at tested narrow and wide sizes.

## Recommendations by Priority

1. **Immediate:** repair mobile toggle semantics, form label associations, admin row keyboard access, and command-palette focus management; replace alert/console-only failure paths with announced status UI.
2. **Short-term:** clear the 11 lint errors and 2 warnings, add deterministic render values, add request cancellation, and raise essential text contrast.
3. **Medium-term:** normalize touch targets, remove the 800px navbar minimum, implement consistent reduced-motion behavior, and establish semantic CSS color tokens.
4. **Long-term:** lazy-load and resize parallax media, split the 510 KB JavaScript chunk, add automated axe/contrast/keyboard checks, and revise the landing composition around real dispute evidence.

## Suggested Commands for Fixes

- `/harden`: H1-H3, H2, M3, M7, L2; focus, keyboard, labeling, status messages, and reduced-motion behavior.
- `/normalize`: H4, M1, M8, L3-L4; lint cleanup, contrast/token alignment, icon semantics, and visual-system refinement.
- `/optimize`: M5-M6, L1; image loading, request lifecycle, dependency cleanup, and route/code splitting.

## Verification Performed

- `npm run lint`: **failed**, 11 errors and 2 warnings.
- `npm run build`: **passed**, with Vite warning that the minified JS chunk is 510.02 KB.
- Live Vite render: phone and desktop viewport checks; no horizontal body overflow observed in either tested viewport.
- Static source scan: image alt coverage, hard-coded visual tokens, interactive elements, form controls, and dialog/navigation semantics.