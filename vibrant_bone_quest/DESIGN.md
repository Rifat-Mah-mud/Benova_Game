---
name: Vibrant Bone Quest
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#5b3f43'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#8f6f73'
  outline-variant: '#e4bdc2'
  surface-tint: '#bc004b'
  primary: '#b80049'
  on-primary: '#ffffff'
  primary-container: '#e2165f'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2be'
  secondary: '#005db6'
  on-secondary: '#ffffff'
  secondary-container: '#63a1ff'
  on-secondary-container: '#00376f'
  tertiary: '#00647c'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f9c'
  on-tertiary-container: '#fafdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#ffb2be'
  on-primary-fixed: '#400014'
  on-primary-fixed-variant: '#900038'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#a9c7ff'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#00468c'
  tertiary-fixed: '#b7eaff'
  tertiary-fixed-dim: '#4cd6ff'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  touch-target-min: 48px
  element-gap: 20px
---

## Brand & Style

The design system is centered on a "Medical Play" aesthetic—a sophisticated blend of high-end pharmaceutical reliability and kid-friendly engagement. It targets pediatric patients and parents, transforming medical education into a tactile, rewarding experience.

The visual style is **Soft-Tactile Modernism**. It avoids the clutter of traditional games in favor of a clean, medical-grade interface that uses depth and soft geometry to feel approachable. The mascot—a friendly, modular skeleton—serves as the primary progress indicator. This mascot must evolve across five stages, moving from a slender, slightly translucent frame to a robust, opaque, and "glowing" healthy state, symbolizing calcium absorption. 

The emotional response should be one of "Confident Joy"—removing the fear of medical topics through soft shapes and high-energy colors.

## Colors

The palette is anchored by "Bonova Magenta" and "Trust Blue." 

- **Primary (Magenta):** Used for "Action" states, primary buttons, and success feedback. It represents energy and the "Quest" aspect of the brand.
- **Secondary (Blue):** Used for headers, navigational anchors, and instructional text. It provides the "Medical" grounding.
- **Tertiary (Sky):** Used for highlights, progress bar fills, and mascot "glow" effects.
- **Neutral:** A cool-toned off-white/light-grey is used for background surfaces to ensure the vibrant primary colors pop without causing eye fatigue.

Color should be applied with high contrast to ensure accessibility for younger users and those in clinical environments with varying lighting.

## Typography

The design system utilizes **Plus Jakarta Sans** for its friendly, open counters and modern, rounded terminals. 

- **Hierarchy:** Use heavy weights (700-800) for all interactive elements and headers to maintain a "game-like" feel. 
- **Readability:** Body text should never drop below 18px to accommodate younger readers and quick scanning on mobile devices.
- **Styling:** Headlines should use tighter letter-spacing to feel impactful and "branded," while body text maintains standard spacing for legibility.

## Layout & Spacing

This design system employs a **Fluid-Portrait Model** optimized for one-handed mobile use. 

- **Grid:** A simple 4-column fluid grid for interior cards, but primarily a single-column stack for the main quest flow.
- **Safe Zones:** 24px horizontal margins ensure content never hits the screen edge.
- **Thumb Zone:** Primary interactive elements (Next, Spin, Collect) must be placed in the bottom 40% of the viewport.
- **Vertical Rhythm:** A strict 8px baseline grid is used to maintain consistency between text blocks and buttons.

## Elevation & Depth

To create a "tactile" feel without being dated, the design system uses **Ambient Tonal Depth**. 

- **Surfaces:** Use high-diffusion shadows (Blur: 20px+, Opacity: 8%) tinted with the Secondary Blue color rather than pure black. This makes elements feel like they are floating over a medical surface.
- **Layering:** The Mascot sits on the lowest elevation level, while quest cards and dialogs sit on the highest.
- **Inner Depth:** Interactive fields use a subtle inner shadow (1-2px) to look "pressed" or "ready to fill," providing a physical metaphor for children.

## Shapes

The shape language is strictly **Hyper-Rounded**. 

- **Radius:** Standard components use a 16px (1rem) radius. Large containers and cards use 24px (1.5rem).
- **Mascot Integration:** Bone shapes and UI containers should share the same corner radius logic to feel part of the same world.
- **Buttons:** Use a fully "pill-shaped" (999px) radius for primary actions to distinguish them from informational cards.

## Components

- **Action Buttons:** Large, pill-shaped buttons with a subtle 3D "press" effect (downward shift of 2px on active state). Use Magenta for primary "forward" actions.
- **Quest Cards:** White surfaces with a 1px soft-blue border and rounded corners. These hold questions or facts.
- **Progress Stage Tracker:** A horizontal bar using the Tertiary Sky color, featuring 5 bone-shaped nodes that light up as the mascot evolves.
- **Mascot Container:** A dedicated circular or arched viewport in the upper half of the screen where the skeleton resides.
- **Selection Chips:** Used for multiple-choice answers; these should be large (min-height 56px) and toggle from a white background to a Secondary Blue background when selected.
- **Success Toasts:** Rounded overlays that appear with a "pop" animation, using the Primary Magenta color and bold white typography.