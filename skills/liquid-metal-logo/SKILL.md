---
name: liquid-metal-logo
description: Turn a logo, icon or SVG into an animated chrome / liquid-metal WebGL effect, like paper-design's liquid.paper.design ("liquid-logo"). Use when the user mentions liquid-logo, liquid metal, chrome or mercury logo, a "make my logo metallic/animated" hero, Paper shaders' LiquidMetal, or links github.com/paper-design/liquid-logo, in React/Next.js or plain HTML.
---

# Liquid metal logo

The effect comes from [paper-design/liquid-logo](https://github.com/paper-design/liquid-logo), the Next.js app behind [liquid.paper.design](https://liquid.paper.design). You upload a logo and it renders as flowing, chromatic liquid metal.

**Don't copy that repo's code into a project.** It is licensed under **PolyForm Shield 1.0.0**, which forbids using it in anything that competes with Paper, and its shader is an older version. Paper ships the same effect as a maintained, **Apache-2.0** component, `LiquidMetal`, in [`@paper-design/shaders`](https://github.com/paper-design/shaders). Use that package. Read the original repo only to understand how it works.

## How it works

1. **Preprocessing** (`toProcessedLiquidMetal`, on the CPU, once per image): the logo is turned into a mask (transparent pixels are outside, everything else is inside). The code then solves a **Poisson equation** inside the shape with zero at its boundary. That produces a smooth "height" field that is high in the middle and drops to zero at the edges, a soft bevel that thick shapes get more of. The result is a PNG: R = the edge gradient, G = opacity.
2. **The shader** (WebGL2): it draws animated stripes of light and dark (a reflection of the environment), bends them along the bevel and with simplex noise (the "liquid"), and offsets the red and blue channels to get the rainbow dispersion. It then masks the result to the logo's shape.

## React / Next.js (recommended)

```bash
npm i @paper-design/shaders-react   # React 18 or 19; pulls in @paper-design/shaders
```

```tsx
'use client' // Next.js App Router: WebGL + image processing only run in the browser
import { LiquidMetal } from '@paper-design/shaders-react'

export function MetalLogo() {
  return (
    <LiquidMetal
      image="/logo.svg"          // transparent SVG/PNG, same-origin or CORS-enabled
      style={{ width: 480, height: 480 }}
      colorBack="#00000000"      // transparent canvas; the default is grey '#AAAAAC'
      colorTint="#ffffff"        // colour-burn tint over the metal
      repetition={2}             // stripe density (1–10)
      softness={0.1}             // 0 = hard stripes, 1 = smooth gradient
      shiftRed={0.3} shiftBlue={0.3} // chromatic dispersion (-1–1)
      distortion={0.07}          // noise wobble (0–1), the "liquid"
      contour={0.4}              // how much the edges bend the pattern (0–1)
      angle={70}                 // stripe direction in degrees
      speed={1}                  // 0 stops the render loop entirely
      scale={0.6} fit="contain"
    />
  )
}
```

- Presets: `import { liquidMetalPresets, defaultPreset, noirPreset, fullScreenPreset, stripesPreset } from '@paper-design/shaders-react'` and spread `{...noirPreset.params}`.
- Without an `image`, it draws a built-in `shape`: `'circle' | 'daisy' | 'diamond' | 'metaballs' | 'none'`. The `fullScreenPreset` (`shape: 'none'`) is an abstract metal backdrop.
- `suspendWhenProcessingImage` suspends during preprocessing, so wrap the component in `<Suspense fallback={<img src="/logo.svg" />}>` to avoid an empty frame while it processes.
- The component is a `<div>` that sizes to its CSS box and accepts all div props. Other props: `minPixelRatio` (default 2), `maxPixelCount`, `frame` (a fixed time, for deterministic stills), `rotation`, `offsetX/Y`.

## Plain HTML / Vue / Svelte

Copy `assets/liquid-metal.js` (bundled with this skill and tested in Chromium) into the project and run `npm i @paper-design/shaders`. The package has no dependencies.

```js
import { mountLiquidMetal, keyOutBackground } from './liquid-metal.js'

const el = document.querySelector('#logo') // give it a CSS width/height
const lm = await mountLiquidMetal(el, '/logo.svg', { colorTint: '#9ad', repetition: 3 })
lm.set({ distortion: 0.2 })  // live updates
lm.mount.setSpeed(0)         // pause
lm.dispose()                 // on unmount: frees the WebGL context
```

To use it without a bundler, load the package through an import map pointing at `https://cdn.jsdelivr.net/npm/@paper-design/shaders@<exact-version>/dist/index.js`.

## Gotchas

1. **Only transparency counts as background.** A logo on a white (or any solid) background renders as a **metal rectangle**. The original app treated pure white as empty, but the package does not. Use a transparent SVG or PNG, or key the background out first with `await keyOutBackground(src, { color: [255,255,255], tolerance: 24 })` from `liquid-metal.js`, which returns a URL you can pass as `image`.
2. **Logo colours are ignored, and so are gradients.** Only the silhouette matters. Thin strokes and small text get almost no bevel and look flat, so bold, chunky marks look best. For hairline logos, use a heavier version of the mark, or a larger `scale` with a lower `contour`.
3. **Cross-origin images need CORS.** The image is drawn to a canvas, so a remote logo without `Access-Control-Allow-Origin` taints the canvas and processing fails. Serve it from your own domain.
4. **Preprocessing is synchronous CPU work** (SVGs are rasterized at up to 4096px before processing), so it can stall the main thread for a moment on large images. Process once and reuse it. Don't change `image` on every render.
5. **It needs WebGL2.** Show a fallback (the plain logo) if the browser doesn't support it. Each mount uses one WebGL context, and browsers allow about 16, so don't render dozens of them.
6. **Performance:** it renders at a pixel ratio of at least 2 and pauses automatically when the element is off-screen or the tab is hidden. For large hero sizes on low-end devices, lower `minPixelRatio` (for example to 1) or set `maxPixelCount`. Set `speed={0}` for a static render that costs nothing per frame.
7. **Dark backgrounds** suit it best. On light pages, set `colorBack` to the page colour, or keep the canvas transparent and use the `noirPreset` for contrast.
8. **Accessibility:** the canvas has no text alternative. Add `role="img"` and `aria-label="<Brand> logo"`. Under `prefers-reduced-motion: reduce`, pass `speed={0}`.
9. **Exporting:** for a still image, render with `speed={0} frame={N}` and call `canvas.toDataURL()` on the canvas inside the element. Recording video requires `canvas.captureStream()` with MediaRecorder.

## About the original repo (for reference only)

- Its `src/hero/parse-logo-image.ts` is a readable, unoptimized version of the Poisson bevel: 300 Jacobi iterations, then `pow(u, 2)` and inversion, at 500–1000px. Its `src/app/hero/liquid-frag.ts` is the first version of the shader. Its controls (`refraction`, `edge`, `patternBlur`, `liquid`, `speed`, `patternScale`) roughly correspond to the package's `shiftRed/shiftBlue`, `contour`, `softness`, `distortion`, `speed` and `repetition`.
- The app uploads processed logos to Vercel Blob (`/api/user-logo`) to make share links at `/share/<id>`. Running it yourself requires `BLOB_READ_WRITE_TOKEN`.
- PolyForm Shield allows using, modifying and redistributing it **only** with the license attached and **not** in anything that competes with Paper. Point users to the Apache-2.0 package instead.
