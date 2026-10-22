---
name: shadergradient
description: Add animated 3D mesh/shader gradients (moving blobs, waves, spheres of colour) to websites with ShaderGradient (@shadergradient/react, @shadergradient/vue) by ruucm — hero backgrounds, cards, gradient spheres, Stripe-style animated gradients. Use when the user mentions ShaderGradient, shadergradient.co, a "customize" gradient URL, an animated/moving/3D/mesh gradient background, or the Figma/Framer ShaderGradient plugin, in React, Next.js, Vue or Nuxt.
---

# ShaderGradient

[ruucm/shadergradient](https://github.com/ruucm/shadergradient) (MIT) renders a noise-displaced 3D mesh (a plane, a sphere or a water plane) shaded with three colours, plus lighting and film grain. It is built on three.js with React Three Fiber (React) or TresJS (Vue). Designers tune it visually at **[shadergradient.co/customize](https://www.shadergradient.co/customize)** and copy a URL, and the code renders that URL.

Packages: `@shadergradient/react` (only the renderer: `ShaderGradientCanvas` and `ShaderGradient`), `@shadergradient/vue` (Vue 3 and Nuxt). The Figma plugin and the Framer component are separate no-code options.

## Install (React)

```bash
npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls
npm i -D @types/three
```

Match `@react-three/fiber` to React:

| Environment | React | @react-three/fiber |
| --- | --- | --- |
| Next.js 15 App Router | 19 | **9** (v8 breaks; ruucm/shadergradient#138) |
| Next 14, Next 15 Pages Router, Vite, CRA | 18 or 19 | 8 with React 18, 9 with React 19 |

`three` must be ≥ 0.158. No `transpilePackages` or aliases are needed.

## Basic usage

```tsx
'use client' // Next.js App Router
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

export function HeroGradient() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, zIndex: -1 }}
      pointerEvents="none"  // background: don't let drags and wheel rotate or zoom it
      pixelDensity={1}      // 1 = fast; 1.5–2 = sharper but heavier
      fov={45}
    >
      <ShaderGradient
        type="waterPlane"   // 'plane' | 'sphere' | 'waterPlane'
        color1="#ff5005" color2="#dbba95" color3="#d0bce1"
        uSpeed={0.4} uStrength={4} uDensity={1.3} uFrequency={5.5}
        cDistance={3.6} cPolarAngle={90} cAzimuthAngle={180}
        grain="on"
      />
    </ShaderGradientCanvas>
  )
}
```

The canvas fills its parent (`width/height: 100%`), so **the parent needs a height**. Any prop you leave out falls back to the **`halo` preset**.

## Props reference

**Shape and motion:** `type` (`plane` | `sphere` | `waterPlane`), `animate` (`'on'|'off'`), `uSpeed` (0.4), `uStrength` (noise height, 4), `uDensity` (1.3), `uFrequency` (5.5), `uAmplitude` (1), `uTime` (start time). `range='enabled'` with `rangeStart`/`rangeEnd` plays a time window. `loop='on'` with `loopDuration` (seconds) loops smoothly.

**Look:** `color1/2/3` (hex), `shader` (`defaults` | `positionMix` | `cosmic` | `glass`), `reflection` (0.1), `wireframe`, `grain` (`'on'|'off'`), `grainBlending`.

**Light:** `lightType='3d'` (ambient light, set with `brightness`, default 1.2) or `'env'` (an HDR reflection map, `envPreset`: `city` | `dawn` | `lobby`).

**Placement:** `positionX/Y/Z`, `rotationX/Y/Z` (degrees).

**Camera:** `cAzimuthAngle`, `cPolarAngle` (degrees), `cDistance` (planes), `cameraZoom` (spheres, which always sit at a fixed distance of 14), `smoothTime`, `enableTransition`, `zoomOut`. `onCameraUpdate(updates)` fires after the user moves the camera.

**Canvas** (`ShaderGradientCanvas`): `pixelDensity` (1), `fov` (45), `pointerEvents`, `lazyLoad` (true), `threshold` (0.1), `rootMargin`, `envBasePath`, `preserveDrawingBuffer`, `powerPreference`, `style`, `className`.

**Presets:** `import { presets } from '@shadergradient/react'` gives `halo`, `pensive`, `mint`, `interstella`, `nightyNight`, `violaOrientalis`, `universe`, `sunset`, `mandarin`, `cottonCandy`. Use one with `<ShaderGradient {...presets.mint.props} />`. Preset props include `pixelDensity` and `fov`; those only take effect on the canvas.

## Using a customizer URL

The library's `control="query" urlString="…"` mode has a trap in `@shadergradient/react`: **every setting missing from the URL renders a blank canvas**, because query mode replaces the preset entirely instead of falling back to it. The README's own short example URL renders nothing (tested on 2.4.20). The full URL that the customizer's copy button produces works, but a trimmed or hand-edited one fails.

Use `assets/fromCustomizerUrl.ts` (bundled with this skill and tested) instead. It layers the URL's settings over a preset and separates out the canvas settings:

```tsx
import { fromCustomizerUrl } from './fromCustomizerUrl'
const { gradient, canvas } = fromCustomizerUrl('https://www.shadergradient.co/customize?type=sphere&cameraZoom=9&color1=%23ff5005')

<ShaderGradientCanvas {...canvas} pointerEvents="none"><ShaderGradient {...gradient} /></ShaderGradientCanvas>
```

Pass a preset as the second argument to use different defaults: `fromCustomizerUrl(url, presets.mint.props)`. The Vue package doesn't have this problem, because it keeps the defaults for missing settings.

## Vue 3 / Nuxt

```bash
npm i @shadergradient/vue vue@^3.5 @tresjs/core@^5 three@^0.186.0
```

```vue
<script setup lang="ts">
import { ShaderGradient, ShaderGradientCanvas, presets } from '@shadergradient/vue'
</script>
<template>
  <ShaderGradientCanvas style="height: 400px" :pixel-density="1.5">
    <ShaderGradient v-bind="presets.mint.props" />
    <template #fallback><div style="height:100%;background:#94ffd1" /></template>
  </ShaderGradientCanvas>
</template>
```

The props are the same as React's, written in kebab-case in templates. It works with Nuxt's server-side rendering without a module or `ssr: false`: the server renders the `#fallback` slot and the canvas mounts in the browser. The Vue package also respects reduced motion, ignores pointer input by default (`pointer-events="auto"` turns it on), marks the canvas `aria-hidden`, emits `@camera-update` and `@error`, and loads only the selected HDR.

## Gotchas

1. **Blank canvas in query mode** (React): see "Using a customizer URL" above. Use `fromCustomizerUrl` or plain props.
2. **The gradient captures input.** The React canvas responds to pointer input by default: dragging rotates, the wheel dollies or zooms, and one-finger touch rotates. On a background this steals scrolling and clicks. Set `pointerEvents="none"`.
3. **The parent needs a height.** Otherwise the canvas is 0px tall. For a full-page background, use `position: fixed; inset: 0; z-index: -1` on the canvas `style`.
4. **`lightType="env"` loads three HDR files from GitHub Pages** (`city`, `dawn` and `lobby`, about 1 MB each) even though only one is used. For production, privacy or offline use, self-host `city.hdr`, `dawn.hdr` and `lobby.hdr` and set `envBasePath="/hdr/"`. `lightType="3d"` loads nothing extra.
5. **`lazyLoad` (on by default) unmounts the canvas when it's off-screen** and creates a fresh one when it scrolls back into view, so there's a brief flash and the animation restarts. Set `lazyLoad={false}` for always-visible heroes, or keep it on for gradients further down the page to save the GPU.
6. **Changing `pixelDensity` or `fov` remounts the whole canvas** (they're part of its `key`). Don't animate them.
7. **Performance:** each canvas is a full WebGL scene with an extra grain pass. Keep `pixelDensity` at 1 for full-screen backgrounds, use `grain="off"` on weak devices, and limit how many gradients are visible at once (one canvas per gradient).
8. **Reduced motion and accessibility (React):** the React package doesn't handle these. Check `matchMedia('(prefers-reduced-motion: reduce)')` and pass `animate="off"`. Add `aria-hidden` to a decorative wrapper. Provide a pause control for long animated backgrounds.
9. **Static or exported images:** use `animate="off"` with a fixed `uTime`. For `canvas.toDataURL()` screenshots, set `preserveDrawingBuffer` on the canvas.
10. **Sphere vs plane camera:** spheres ignore `cDistance` and use `cameraZoom` (about 5–15). Planes use `cDistance` (about 2–6) with zoom 1. Mixing them up gives an empty or huge view.
11. **Don't reach into the library's internals.** v2 ships no store or controls. The UI components (`@shadergradient/ui`) aren't on npm, so build your own controls that change the props.

## Working on the repo itself

pnpm + turbo monorepo: `pnpm install`, `pnpm dev`. The code is in `packages/shadergradient` (React; GLSL in `src/shaders/*`, presets in `src/presets.ts`) and `packages/shadergradient-vue`. Apps (Next, Nuxt and Vue examples, the Figma and Framer plugins) are in `apps/`. Releases use changesets (`pnpm changeset`, `pnpm version-packages`, `pnpm release`). Vue work follows `CONTRIBUTING-VUE.md`.
