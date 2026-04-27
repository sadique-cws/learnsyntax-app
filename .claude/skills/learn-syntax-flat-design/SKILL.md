---
name: learn-syntax-flat-design
description: "Always invoke when building or modifying UI components for Learn Syntax. This design system prioritizes a flat, compact, and premium aesthetic inspired by modern Android apps and admin panels. Key rules: No shadows, no gradients, rounded corners, tight spacing, and brand-aligned colors (Blue/Purple)."
license: MIT
---

# Learn Syntax Design System (Flat & Compact)

Follow these rules strictly to maintain visual consistency across the application.

## Core Design Principles

1.  **Strictly 2D/Flat**: Never use box shadows or depth-based effects.
    -   Use `shadow-none` on all containers, cards, and buttons.
    -   Use thin borders (`border border-border`) to define boundaries instead of shadows.

2.  **Rounded Aesthetics**: Use rounded corners for a modern, friendly feel.
    -   Standard: `rounded-lg` (8px)
    -   Large Components: `rounded-xl` (12px) or `rounded-2xl` (16px)

3.  **No Gradients**: Use solid background colors only.
    -   Primary: `bg-primary` (Branding Blue)
    -   Secondary/Accent: `bg-purple-600` or custom brand purple.
    -   Backgrounds: `bg-background` (White/Light Gray) or `bg-muted` (Off-white).

4.  **Compact Layouts**: Reduce whitespace to increase information density.
    -   Use `p-2` or `p-3` for cards instead of `p-6`.
    -   Use `gap-2` or `gap-3` for grids and flex containers.
    -   Reduce font sizes slightly for secondary information (`text-sm`, `text-xs`).

5.  **Android-Style Mobile UX**:
    -   **Bottom Navigation**: Use a fixed bottom bar for primary mobile navigation.
    -   **Floating Action Buttons (FAB)**: Use for primary actions on mobile, but keep them flat (no shadow).
    -   **Top App Bar**: Simple, centered title with back button on the left.

## Tailwind v4 Theme Configuration

The following theme variables are defined in `app.css`:

```css
@theme {
    --color-primary: #3D7AE5; /* Brand Blue */
    --color-brand-purple: #8A3FFC; /* Brand Purple */
    --radius: 0.75rem; /* Consistent rounding */
}
```

## Component Patterns

### Flat Card
```html
<div class="bg-card border border-border rounded-xl p-3 shadow-none">
    <!-- Content -->
</div>
```

### Compact Button
```html
<button class="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-none transition-colors hover:bg-primary/90">
    Action
</button>
```

### Mobile Bottom Nav
```html
<nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-2 md:hidden">
    <a href="#" class="flex flex-col items-center text-xs text-muted-foreground">
        <IconHome class="size-6" />
        <span>Home</span>
    </a>
    <!-- ... -->
</nav>
```

## "I never future explain"
Keep implementations concise. Do not add redundant comments or explanations in the code unless necessary for complex logic. Focus on the visual result.
