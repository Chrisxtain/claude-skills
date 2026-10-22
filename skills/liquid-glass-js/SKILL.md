---
name: liquid-glass-js
description: Add Apple "Liquid Glass"-style refractive glass buttons, pills, circles and panels to a web page with the liquid-glass-js library (WebGL shaders + html2canvas). Use when the user mentions liquid-glass-js, Liquid Glass / glassmorphism / frosted or refractive glass UI on the web, or wants glass buttons/toolbars/nav bars with real refraction rather than plain CSS backdrop-filter.
---

# liquid-glass-js

[dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js) (MIT) is a small vanilla JS library with two global classes:

- **`Container`** draws a glass surface: a `<div class="glass-container">` with a WebGL `<canvas>` behind its children.
- **`Button extends Container`** adds a text label, a click handler and automatic sizing from the text.

**How it works:** the first instance takes a screenshot of `document.body` with **html2canvas**, skipping the glass elements. Each instance uploads that screenshot as a texture. A fragment shader then refracts, blurs (13×13 Gaussian), tints and masks the part of the screenshot behind the element, in the element's shape: rounded rectangle, circle or pill. A `Button` placed inside a `Container` samples the container's live canvas instead of the page, so you get glass on glass.

It is **not on npm** and has no ES module or bundle. You copy the files in and load them with plain `<script>` tags, which define globals.

## Setup

The library files are bundled in this skill's `assets/` folder: `container.js`, `button.js`, `glass.css`, `LICENSE`, and `glass-helpers.js` (helpers written for this skill). Copy them into the project's static or public folder and keep the LICENSE with them.

```html
<link rel="stylesheet" href="glass.css" />
<!-- order matters: html2canvas → container → button → helpers -->
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="container.js"></script>
<script src="button.js"></script>
<script src="glass-helpers.js"></script>
```

- `container.js` refers to `Button`, so **load both files** even if you only use `Container`.
- WebGL needs the page to be served over HTTP, for example with `npx serve .`. Opening it from `file://` won't work.
- With npm, html2canvas can come from the `html2canvas` package, as long as it ends up on `window.html2canvas`.

## API

```js
new Button({
  text: 'Save',        // label (default 'Button')
  size: 24,            // font size in px, which also drives the button's dimensions (default 48)
  type: 'pill',        // 'rounded' | 'circle' | 'pill' (default 'rounded')
  tintOpacity: 0.2,    // 0–1 white/grey tint (default 0.2)
  warp: false,         // extra center distortion (default false)
  onClick: text => {}  // receives the button's text
})

new Container({
  type: 'pill',        // 'rounded' | 'circle' | 'pill'
  borderRadius: 24,    // only applies to 'rounded'; pill/circle compute their own
  tintOpacity: 0.2
})

container.addChild(button)    // appends button.element; a Button becomes nested glass
container.removeChild(button)
container.updateSizeFromDOM() // re-measure the element and resize the canvas on the next frame
instance.element              // the DOM node you append yourself
instance.render()             // redraw once (standalone glass)
Container.instances           // every live instance
```

Sizing: a circle button is `2.5 × size` square. Pill and rounded buttons are sized from the measured text width plus `2 × size` horizontal padding. A **Button ignores the `borderRadius` option** (the README example is wrong): rounded buttons always use `borderRadius = size`.

## Typical usage

```js
// Standalone button
const hello = new Button({ text: 'Hello', size: 28, type: 'rounded', onClick: t => console.log(t) })
document.querySelector('#hero').appendChild(hello.element)

// Toolbar: glass container with nested glass buttons
const bar = new Container({ type: 'pill', tintOpacity: 0.15 })
;['▶', '⏺', '⏭'].forEach(icon => bar.addChild(new Button({ text: icon, size: 22, type: 'circle' })))
document.querySelector('#toolbar').appendChild(bar.element)
```

Non-glass content (an icon, an input) can go inside a container too: `bar.element.appendChild(el)`, then `bar.updateSizeFromDOM()`. `.glass-container` is a flex row with `gap: 20px; padding: 10px`.

## Global effect parameters

Every instance reads `window.glassControls` **once, when its shader is set up**. Define it before creating instances, and use `applyGlassParams()` (from `glass-helpers.js`) to change it on live instances.

| Key | Default | Useful range | Effect |
| --- | --- | --- | --- |
| `edgeIntensity` | 0.01 | 0–0.1 | refraction at the edges |
| `rimIntensity` | 0.05 | 0–0.2 | rim highlight distortion |
| `baseIntensity` | 0.01 | 0–0.05 | center distortion (only with `warp`) |
| `edgeDistance` | 0.15 | 0.05–0.5 | edge falloff |
| `rimDistance` | 0.8 | 0.1–2.0 | rim falloff |
| `baseDistance` | 0.1 | 0.05–0.3 | center falloff |
| `cornerBoost` | 0.02 | 0–0.1 | extra corner refraction |
| `rippleEffect` | 0.1 | 0–0.5 | concentric ripple texture |
| `blurRadius` | 5 (nested buttons: 2) | 1–15 | background blur |

```js
window.glassControls = { blurRadius: 8, rimIntensity: 0.08 } // before creating instances
applyGlassParams({ rippleEffect: 0, tintOpacity: 0.35 })    // later, on all instances
applyGlassParams({ warp: true }, [hello])                    // or on specific ones
```

## Gotchas (from reading the source)

1. **A `0` in `window.glassControls` is ignored at creation.** The setup code uses `value || default`, so `rippleEffect: 0` becomes `0.1`. To turn an effect off, call `applyGlassParams({ rippleEffect: 0 })` after the instances have initialized, or edit the defaults in `container.js`/`button.js`.
2. **The background is a one-time snapshot.** It is taken when the first instance is created, so the glass shows the page as it was then. It doesn't update for content that loads later, images that load late, theme changes, animated or video backgrounds, or window resizes. Call `recaptureGlass()` after any of these, debouncing it for resize. Create the glass **after** the page content and images have loaded (for example on `window.load`).
3. **The glass only shows what html2canvas can render.** Cross-origin images need CORS headers. `backdrop-filter`, some blend modes and filters, `<video>`, `<iframe>` and WebGL canvases may be missing or wrong in the snapshot. The snapshot is taken at `scale: 1`, so the glass looks soft on high-DPI screens.
4. **Standalone glass only redraws on scroll.** If it moves without a scroll (animations, drag, layout changes, sticky positioning tricks), call `instance.render()` or run `const stop = animateGlass()` while it moves. Nested buttons already redraw every frame.
5. **Append `.element` in the same task you create the instance.** The size is measured on the next animation frame. If you attach the element later, call `instance.updateSizeFromDOM()` after appending.
6. **Each instance creates its own WebGL context.** Browsers allow roughly 16 at a time and drop the oldest beyond that. Keep the number of glass elements small, and group buttons in a container where you can.
7. **There is no `destroy()`.** Instances stay in `Container.instances`, and nested buttons keep a `requestAnimationFrame` loop running. Use `destroyGlass(instance)` from `glass-helpers.js` to remove the element, drop it from the registry and release its WebGL context. Destroy a container to destroy its children as well.
8. **The README says WebGL 2, but the code uses `getContext('webgl')` (WebGL 1).** If WebGL is unavailable it logs `WebGL not supported` and shows no glass. Give the element a CSS fallback (for example `background: rgba(255,255,255,.2); backdrop-filter: blur(10px)`) if that matters.
9. **The glass needs something behind it.** On a flat background it just looks like a tinted blur. Use it over images, gradients or rich content.
10. **Accessibility:** buttons are `<div>`s. Add `role="button"`, `tabindex="0"`, an `aria-label` and Enter/Space key handling on `button.element`, and keep the text contrast readable.

## React, Vue and other frameworks

Create the instances in a mount effect and append them to a ref. Tear them down on unmount so StrictMode's double mount doesn't leak WebGL contexts:

```jsx
function GlassButton({ text, onClick, ...opts }) {
  const host = useRef(null)
  useEffect(() => {
    const btn = new Button({ text, onClick, ...opts })
    host.current.appendChild(btn.element)
    return () => destroyGlass(btn)
  }, [text])
  return <span ref={host} />
}
```

Load the scripts globally, through `<script>` tags in `index.html` or by copying them to `public/`, because the files aren't modules. For TypeScript, declare them: `declare const Button: any, Container: any, applyGlassParams: any, recaptureGlass: any, destroyGlass: any`. Call `recaptureGlass()` after route changes that change the background.

## Customizing the look

- Text: style `.glass-button-text`, which is white `system-ui` by default. Shadow: `.glass-button { box-shadow }` (the canvas also gets an inline shadow).
- Tint colour: the shader mixes toward white/grey. To tint with a colour, edit `topTint`/`bottomTint` in the fragment shader in `container.js` (and the nested shader in `button.js`).
- New shapes: add a signed-distance function next to `roundedRectDistance`/`pillDistance` in both shaders.
