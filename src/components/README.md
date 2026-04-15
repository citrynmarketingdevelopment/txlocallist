# Shared Components

Every component used on more than one route lives here. Anything that stays on a single page may remain colocated with that page.

## Conventions

```
src/components/ComponentName/
  ComponentName.jsx          # the component
  ComponentName.module.css   # local styles, reference tokens from globals.css
  index.js                   # re-export for ergonomic imports
```

Import via the barrel export:

```js
import { Navbar, Footer, SearchBar, BusinessCard, Button } from "@/components";
```

## Design tokens

All colors, radii, shadows, motion, and z-index tokens are defined in
`src/app/globals.css` under `:root`. Component stylesheets should reference
those CSS variables rather than raw hex values, so the whole site can be
re-skinned from one file.

## Accessibility defaults

- Interactive targets are at least 44×44 px.
- Focus states use `:focus-visible` with the teal outline defined globally.
- Icon-only buttons must carry an `aria-label`.
- Motion is suppressed when `prefers-reduced-motion` is set (handled globally).

## Current inventory

- `Navbar` — top navigation used on public marketing pages.
- `Footer` — marketing footer with nav + socials.
- `SearchBar` — hero search (keyword + city), submits to `/search` by default.
- `BusinessCard` — directory card used on the home page and future city/category pages.
- `Button` — retro chunky button with variants (`primary`, `secondary`, `cream`, `ghost`) and sizes.
