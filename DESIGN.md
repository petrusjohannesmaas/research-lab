---
name: DevDoc Modern
colors:
  surface: '#faf8ff'
  surface-dim: '#d8d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fe'
  surface-container: '#ecedf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#424655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#eff0fc'
  outline: '#727786'
  outline-variant: '#c2c6d7'
  surface-tint: '#0056d0'
  primary: '#0053c9'
  on-primary: '#ffffff'
  primary-container: '#1d6bf3'
  on-primary-container: '#fcfaff'
  inverse-primary: '#b1c5ff'
  secondary: '#535f74'
  on-secondary: '#ffffff'
  secondary-container: '#d4e0f9'
  on-secondary-container: '#586378'
  tertiary: '#9e3c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64d00'
  on-tertiary-container: '#fffaf9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a0'
  secondary-fixed: '#d7e3fc'
  secondary-fixed-dim: '#bbc7df'
  on-secondary-fixed: '#101c2e'
  on-secondary-fixed-variant: '#3c475b'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  code:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 1.5rem
  margin: 2rem
  section-gap: 5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The brand personality is authoritative yet accessible, designed to bridge the gap between a personal developer portfolio and a high-end technical publication. It targets a dual audience: recruiters looking for professional reliability and fellow developers seeking clear, actionable insights.

The design style is **Corporate / Modern** with a strong emphasis on **Documentation Aesthetics**. It leverages high-density information layouts, crisp structural grids, and a "code-first" visual language. The goal is to evoke a sense of precision, technical mastery, and clarity. Visual cues are taken from modern documentation platforms, using subtle grid backgrounds and clean, functional component styling to ensure the content remains the primary focus.

## Colors

This color palette utilizes a "Developer Blue" foundation to signal technical competence. The primary blue is used for key actions and focus states, while the deep navy secondary color provides high-contrast grounding for headings and navigation elements.

The neutral scale is optimized for readability, moving from a bright white background to deep slate grays for text. The pale blue accent serves as a soft background for code blocks, callouts, and secondary containers, creating a layered depth that feels "technical" without being harsh.

## Typography

The typography system creates a clear distinction between "The Message" and "The Content." **Montserrat** is reserved for structural headings, providing a geometric, modern, and high-impact feel that aligns with a developer's professional identity. 

**DM Sans** is used for all body text and UI labels due to its exceptional legibility and low-stroke contrast, which excels in long-form technical reading. A dedicated monospace style is used for inline code and snippets to maintain the technical context. Large display sizes use tight letter-spacing to appear more "designed," while body text maintains standard tracking for comfort.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop, centered within a maximum width of 1200px to ensure line lengths for blog posts remain optimal for readability. A 12-column grid provides the framework for content layout, typically split into an 8-column main content area and a 4-column sidebar for documentation-style navigation and author metadata.

Spacing follows a strict 4px/8px baseline rhythm. "Section-gap" is used to provide significant breathing room between major content blocks, reflecting the "Clean" requirement. Vertical stacks utilize "stack-md" for related elements (like an image and its caption) and "stack-lg" for distinct paragraphs or sections.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-contrast outlines** rather than heavy shadows. Surfaces are primarily flat, using subtle background color shifts (e.g., transitioning from white to `#f8fafc`) to indicate distinct UI areas.

To reflect a modern documentation aesthetic:
- **Primary Cards:** Use a thin 1px border in a light gray/blue (`#e2e8f0`) with no shadow.
- **Floating Elements (Modals/Popovers):** Use a high-diffusion, low-opacity shadow (`0 10px 25px -5px rgba(0, 0, 0, 0.05)`) to create a soft lift.
- **Code Blocks:** Use the Blue Pale (`#e8f0fe`) background to sit "inside" the page surface, creating a recessed effect.

## Shapes

The shape language is **Soft**, utilizing small border radii to maintain a professional and technical feel without appearing overly playful. This "Soft" approach balances the geometric sharpness of the Montserrat headings.

Standard buttons and input fields use a 0.25rem (4px) radius. Larger containers, such as article cards or code block wrappers, use the `rounded-lg` 0.5rem (8px) radius to soften the overall layout. Avatars and specific decorative accents (like status indicators) may use pill-shaping to stand out against the predominantly rectangular grid.

## Components

### Buttons
- **Primary:** Solid `#1d6bf3` with white text. No gradient.
- **Secondary:** Outline variant with a 1px `#1d6bf3` border and matching text.
- **Tertiary/Ghost:** No border, `#0a1628` text, with a `#f1f5f9` background appearing on hover.

### Cards
- Blog post cards feature a 1px border and a subtle transition where the border color changes to Primary Blue on hover. They should contain a category chip, title, and "minutes read" label.

### Chips & Tags
- Used for categories (e.g., "React", "TypeScript"). These utilize the Blue Pale (`#e8f0fe`) background with Primary Blue text, set in uppercase `label-md` typography.

### Input Fields
- Clean, 1px bordered boxes using Neutrals. On focus, the border shifts to Primary Blue with a 2px outer "glow" using Blue Light at 20% opacity.

### Code Blocks
- Full-width or container-width blocks with a distinctive header bar containing the language name and a "Copy" button. The background is slightly off-white or very pale blue to distinguish from the main article body.

### Navigation
- A sticky top navigation bar with a subtle blur effect (`backdrop-filter: blur(8px)`) and a bottom border to separate it from the content without a heavy shadow.