# Anish Ganesh — interactive portfolio

A personal portfolio website with a Three.js background, an animated network-like shape, smooth scrolling, and sections for education, experience, and contact information.

## Overview

This project is a static web experience built with Vite and browser JavaScript. HTML holds the portfolio content while a separate WebGL scene responds to time, scrolling, and pointer interaction.

## Features

- A deforming icosahedron with a physical material, glowing nodes, and connecting lines.
- A particle field, animated lighting, and bloom post-processing.
- Pointer raycasting and scroll-driven changes to the scene.
- Smooth scrolling, animated section reveals, and section navigation.
- An ambient audio track started after user interaction.

## Architecture

`index.html` supplies the content and canvas. `main.js` initializes the Three.js scene and post-processing composer, coordinates Lenis scrolling and GSAP reveals, and updates geometry and material properties in the animation loop. Howler handles audio playback.

The central shape is a Three.js mesh whose vertices are updated in JavaScript. The network motif is a visual effect, not a neural-network computation. The committed code does not implement the raymarched SDF scene described in earlier documentation.

## Tech stack

| Tool | Role |
| --- | --- |
| Vite 5 | Development server and static build |
| Three.js | WebGL scene, geometry, materials, and raycasting |
| `postprocessing` | Render passes and bloom |
| GSAP | DOM reveal animation |
| Lenis | Smooth scrolling |
| Howler | Ambient audio |
| HTML/CSS | Portfolio content and layout |

## Project structure

- `index.html` — portfolio sections and canvas.
- `main.js` — rendering, interaction, scrolling, and audio.
- `style.css` — page styling.
- `public/audio/calm-ambient.mp3` — audio asset.
- `dist/` — committed build artifacts; regenerate when deploying changes.
- `package.json` — dependency versions and scripts.

## Run locally

```bash
git clone https://github.com/anishkganesh/portfolio.git
cd portfolio
npm install
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`. No dependency lockfile is committed, so installation resolves versions from `package.json`.

## Configuration and data

No backend, database, API keys, or environment variables are required. Text, destinations, and contact links live in `index.html`; visual and audio settings live in `main.js` and `style.css`.

## Usage

Scroll through the sections, hover over the main shape, and use the section navigation. Audio depends on a user interaction because browsers restrict autoplay.

## Validation

```bash
npm run build
npm run preview
```

No lint or automated test script is configured. Check rendering, resizing, section navigation, pointer interactions, and audio in the browsers you intend to support. This documentation review did not establish a runtime or performance benchmark.

## Deployment

Build with `npm run build` and publish `dist/` to a static host. Preserve the audio asset at the path expected by the application. Review Vite's base path and root-relative URLs if hosting under a subdirectory.

## Limitations

- WebGL rendering and bloom require graphics resources and can perform differently across devices.
- Sound is subject to browser autoplay rules.
- The HTML contains some placeholder `#` destinations and references a `/vite.svg` favicon that is not included in this snapshot.
- Personal content should be updated separately when roles, dates, or links change.

## Attribution and license

The audio source is identified in the code as Bensound's “Slow Motion”; verify the applicable asset usage terms before redistributing it. Dependencies retain their own licenses. No standalone project license file is included; this README does not grant a new license.
