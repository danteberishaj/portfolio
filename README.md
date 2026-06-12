# Portfolio

An immersive personal portfolio built with **Next.js 14**, **Three.js** (via
react-three-fiber), and **Framer Motion**.

## Features

- 🌌 Interactive 3D hero — a mouse-reactive distorted blob, floating shards, and a starfield
- 🎞️ Project screenshot slideshows with autoplay, swipe transitions, and dot controls (placeholders included)
- 📜 Scroll-triggered reveal animations throughout
- 🧑 About section with animated skill chips and stats
- 📊 Scroll progress bar + sticky glass navbar
- 📱 Fully responsive, dark-themed design

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Make it yours

- **Text & links:** edit the components in `/components` (Hero, About, Projects, Contact).
- **Name / metadata:** `app/layout.tsx` and the `YN.dev` logo in `components/Navbar.tsx`.
- **Project screenshots:** add images to `public/projects/` and list them in the
  `projects` array in `components/Projects.tsx` (see that folder's README).
- **Colors:** tweak `accent` / `accent2` in `tailwind.config.ts`.

## Tech

| Concern        | Library                          |
| -------------- | -------------------------------- |
| Framework      | Next.js 14 (App Router)          |
| 3D             | three, @react-three/fiber, drei  |
| Animation      | framer-motion                    |
| Styling        | Tailwind CSS                     |
| Language       | TypeScript                       |
