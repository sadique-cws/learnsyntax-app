# Learn Syntax Design System (Android-Inspired Flat UI)

This document outlines the core design skills, tokens, and components used to maintain the unified flat, native-app-inspired aesthetic across the Learn Syntax platform.

## 1. Core Principles

- **Flat Design**: Complete removal of shadows (`shadow-*`), blur effects (`blur-*`), and complex gradients unless absolutely necessary.
- **High Density**: Tight padding, small labels, and structured grids to maximize information density like a native Android application.
- **Crisp Borders**: Consistent use of `border border-border` to define structure, with sharp or subtly rounded corners (`rounded`), instead of heavy radii (`rounded-xl`, `rounded-3xl`).
- **Mobile-First Layout**: Reliance on fixed bottom navigation bars (`pb-safe`) for mobile devices, and horizontal scrolling or tight grids for content.

## 2. Typography

- **Headings**: `font-black`, ``, `tracking-tight`or`tracking-wide`.
- **Sub-labels / Tags**: Highly utilized for categorizing content.
    - Class structure: `text-[10px] font-bold   text-muted-foreground`
- **Interactive Elements**: Bold text for buttons and links.

## 3. Colors & Tokens

- **Solid Backgrounds**: Use `bg-background` for primary surfaces and `bg-muted` or `bg-muted/10` for secondary surfaces.
- **Dark Mode Compatibility**: Rely strictly on CSS variables (`bg-background`, `text-foreground`, `border-border`, `bg-card`) to ensure seamless theme switching.
- **Primary Highlights**: Use `text-primary`, `bg-primary`, and `hover:border-primary` for actionable elements.

## 4. Components

### A. Flat Card Link

A clickable card that is fully wrapped in an Inertia `<Link>` for maximum tap target area.

```tsx
<Link
    href="/destination"
    className="focus-visible:ring-primary group block rounded focus:outline-none focus-visible:ring-2"
>
    <div className="border-border bg-card hover:border-primary group-hover:bg-muted/10 flex h-full flex-col overflow-hidden rounded border transition-colors">
        <div className="bg-muted border-border relative aspect-[16/9] border-b">
            <img
                src="/image.jpg"
                alt="Cover"
                className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
            />
            <div className="bg-background border-border text-foreground absolute right-2 top-2 rounded border px-2 py-1 text-[10px] font-bold">
                Badge Info
            </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
            <div className="text-primary mb-2 text-[10px] font-black">
                Category
            </div>
            <h3 className="text-foreground group-hover:text-primary mb-4 line-clamp-2 text-base font-bold leading-snug transition-colors">
                Title
            </h3>
        </div>
    </div>
</Link>
```

### B. Mobile Bottom Navigation

Hidden on desktop (`md:hidden`), fixed to the bottom on mobile. Replaces header menus and footers.

```tsx
<nav className="bg-background border-border pb-safe fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t md:hidden">
    <Link
        href="/"
        className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex h-full w-full flex-col items-center justify-center transition-colors"
    >
        <Icon className="size-[18px]" />
        <span className="mt-1 text-[10px] font-bold tracking-wider">Label</span>
    </Link>
</nav>
```

### C. Stat Item (Flat Container)

Used for displaying statistics in a grid.

```tsx
<div className="border-border bg-background flex flex-col items-center rounded border p-3 text-center sm:items-start sm:text-left">
    <div className="mb-2 flex items-center gap-2">
        <Icon className="text-primary size-3.5" />
        <span className="text-muted-foreground text-[9px] font-bold">
            Label
        </span>
    </div>
    <div className="text-xs font-bold tracking-tight">Value</div>
</div>
```

## 5. Layout Adjustments

- **Main Container**: Always pad the bottom on mobile to accommodate the bottom nav: `pb-14 md:pb-0`.
- **Global Footer**: Hide on mobile to prioritize screen real estate: `hidden md:block`.
- **Top Header**: Keep slim and sticky (`h-14`, `fixed top-0`, `z-50`). Hide main links on mobile, retaining only essential branding and theme toggles.
