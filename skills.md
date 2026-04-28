# Learn Syntax Design System (Android-Inspired Flat UI)

This document outlines the core design skills, tokens, and components used to maintain the unified flat, native-app-inspired aesthetic across the Learn Syntax platform.

## 1. Core Principles
- **Flat Design**: Complete removal of shadows (`shadow-*`), blur effects (`blur-*`), and complex gradients unless absolutely necessary.
- **High Density**: Tight padding, small uppercase labels, and structured grids to maximize information density like a native Android application.
- **Crisp Borders**: Consistent use of `border border-border` to define structure, with sharp or subtly rounded corners (`rounded`), instead of heavy radii (`rounded-xl`, `rounded-3xl`).
- **Mobile-First Layout**: Reliance on fixed bottom navigation bars (`pb-safe`) for mobile devices, and horizontal scrolling or tight grids for content.

## 2. Typography
- **Headings**: `font-black`, `uppercase`, `tracking-tight` or `tracking-wide`.
- **Sub-labels / Tags**: Highly utilized for categorizing content.
  - Class structure: `text-[10px] font-bold uppercase tracking-widest text-muted-foreground`
- **Interactive Elements**: Bold text for buttons and links.

## 3. Colors & Tokens
- **Solid Backgrounds**: Use `bg-background` for primary surfaces and `bg-muted` or `bg-muted/10` for secondary surfaces.
- **Dark Mode Compatibility**: Rely strictly on CSS variables (`bg-background`, `text-foreground`, `border-border`, `bg-card`) to ensure seamless theme switching.
- **Primary Highlights**: Use `text-primary`, `bg-primary`, and `hover:border-primary` for actionable elements.

## 4. Components

### A. Flat Card Link
A clickable card that is fully wrapped in an Inertia `<Link>` for maximum tap target area.
```tsx
<Link href="/destination" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
    <div className="flex flex-col border border-border bg-card rounded overflow-hidden transition-colors hover:border-primary group-hover:bg-muted/10 h-full">
        <div className="relative aspect-[16/9] bg-muted border-b border-border">
            <img src="/image.jpg" alt="Cover" className="w-full h-full object-cover transition-opacity group-hover:opacity-90" />
            <div className="absolute top-2 right-2 px-2 py-1 bg-background border border-border rounded text-[10px] font-bold text-foreground">
                Badge Info
            </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Category</div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4 leading-snug">
                Title
            </h3>
        </div>
    </div>
</Link>
```

### B. Mobile Bottom Navigation
Hidden on desktop (`md:hidden`), fixed to the bottom on mobile. Replaces header menus and footers.
```tsx
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-center justify-around h-14 pb-safe">
    <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
        <Icon className="size-[18px]" />
        <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Label</span>
    </Link>
</nav>
```

### C. Stat Item (Flat Container)
Used for displaying statistics in a grid.
```tsx
<div className="flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded border border-border bg-background">
    <div className="flex items-center gap-2 mb-2">
        <Icon className="size-3.5 text-primary" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Label</span>
    </div>
    <div className="text-xs font-bold uppercase tracking-tight">Value</div>
</div>
```

## 5. Layout Adjustments
- **Main Container**: Always pad the bottom on mobile to accommodate the bottom nav: `pb-14 md:pb-0`.
- **Global Footer**: Hide on mobile to prioritize screen real estate: `hidden md:block`.
- **Top Header**: Keep slim and sticky (`h-14`, `fixed top-0`, `z-50`). Hide main links on mobile, retaining only essential branding and theme toggles.
