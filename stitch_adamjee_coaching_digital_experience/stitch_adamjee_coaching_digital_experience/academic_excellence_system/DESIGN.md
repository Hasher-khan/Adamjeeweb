---
name: Academic Excellence System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#44474e'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#115cb9'
  on-secondary: '#ffffff'
  secondary-container: '#659dfe'
  on-secondary-container: '#003370'
  tertiary: '#180500'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d1500'
  on-tertiary-container: '#b97958'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#acc7ff'
  on-secondary-fixed: '#001a40'
  on-secondary-fixed-variant: '#004491'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6c391d'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a premium educational coaching environment, specifically tailored to the Karachi academic landscape. The personality is **Professional**, **Academic**, and **Trustworthy**, avoiding the "childish" tropes often associated with primary education in favor of a serious, achievement-oriented aesthetic suitable for secondary and competitive exam preparation.

The design style is **Corporate / Modern** with a focus on high-quality typography and structured information density. It utilizes a refined hierarchy to convey authority while remaining accessible to students and parents. Visual depth is achieved through subtle layering rather than aggressive styling, ensuring the focus remains on educational content and faculty expertise.

## Colors

The palette is anchored by a **Deep Navy Blue**, representing tradition and stability. The **Royal Blue** acts as a supportive secondary color for interactive elements and navigation accents. 

**Gold (Warm Yellow)** is reserved strictly for high-priority Call to Actions (CTAs), achievement highlights, and important alerts, providing a high-contrast focal point against the navy background. The neutral scale uses **Dark Charcoal** for maximum legibility on a crisp **White** or **Very Light Gray** base, maintaining a clean, academic atmosphere.

## Typography

The typography system relies on **Inter** for its exceptional legibility and systematic feel. The scale emphasizes a strong vertical rhythm.

- **Hero Headings:** Use tight letter-spacing and bold weights to command attention on landing pages.
- **Section Headings:** Use semi-bold weights with generous top margins to clearly delineate content blocks.
- **Body Text:** Optimized for long-form reading of course descriptions and faculty bios, utilizing a 1.6x line height.
- **Labels:** Small caps or medium-weight sans-serifs are used for metadata like "Class Timing" or "Subject Category."

## Layout & Spacing

The system follows an **8px linear scale**, ensuring consistent alignment across all components.

- **Grid Model:** A 12-column fluid grid for desktop (up to 1200px) and a 4-column grid for mobile.
- **Margins:** Desktop margins are set to 40px, while mobile uses 16px to maximize content area.
- **Padding:** Content cards and containers use 24px (lg) internal padding to maintain a premium, spacious feel.
- **Vertical Spacing:** Section blocks are separated by 80px (xxl) to prevent cognitive overload.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Shadows**. 

- **Surface 0 (Background):** Pure white or light gray.
- **Surface 1 (Cards/Modals):** Pure white with a 1px border (`#E9ECEF`) and a low-intensity, highly diffused shadow (Blur: 15px, Y: 4px, Color: `rgba(0, 33, 71, 0.08)`).
- **Interactive States:** On hover, cards should lift slightly (Shadow Blur: 25px, Y: 8px) to provide tactile feedback.
- **Overlays:** Navigation and dropdowns use a subtle backdrop blur (8px) to maintain context while focusing user attention.

## Shapes

The shape language is defined by **Rounded** corners to soften the professional tone and make the platform feel student-friendly.

- **Standard Elements:** 8px radius (buttons, input fields).
- **Large Containers:** 16px radius (program cards, faculty profiles, modal windows).
- **Small Accents:** 4px radius (status chips, labels).

## Components

### Buttons
- **Primary:** Deep Navy Blue background, White text. High-contrast and authoritative.
- **Secondary:** Royal Blue outline or light Royal Blue tint. Used for secondary actions.
- **CTA:** Gold background, Navy text. Used exclusively for "Enroll Now" or "Register."
- **Ghost:** Transparent with Navy text, used for navigation items.

### Form Inputs
- **Style:** 1px subtle gray border with 8px radius.
- **States:** Focus state uses a 2px Royal Blue ring. Error states use a soft red border and text.
- **Labels:** Placed above the input in `label-md` style for maximum clarity.

### Cards
- **Faculty Cards:** Feature a circular or softly rounded image on the left/top, with bold headings for names and `label-sm` for designations.
- **Program Cards:** Highlight the subject name in Navy, with a Gold accent bar on the left to indicate importance.

### Navigation
- **Desktop:** Sticky top-bar with a white background, using Navy for links and a CTA button on the far right.
- **Mobile:** Fixed header with a clean hamburger menu that opens a full-screen or slide-out navy-themed drawer.

### Data Displays
- **Timetables:** Use clean horizontal lines (1px) with alternate row striping in `background_secondary`. Header cells use Navy background with White text for high visibility.