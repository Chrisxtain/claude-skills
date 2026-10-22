# R3F API reference (v9)

Condensed from this repo's `docs/API/*.mdx` and `docs/tutorials/v9-migration-guide.mdx`. Read the original `.mdx` files when you need more detail.

## Contents
- Canvas props
- Renderers, ownership and WebGPU
- createRoot (custom canvas) and tree-shaking
- useThree state
- Event data and custom event managers
- TypeScript
- Additional exports
- v8 → v9 differences

## Canvas props

| Prop | Purpose | Default |
| --- | --- | --- |
| `gl` | Renderer props, a renderer instance, or a sync/async factory `(defaults) => renderer` | `{}` |
| `camera` | Props for the default camera, or your own `THREE.Camera` | `{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }` |
| `scene` | Props for the default scene, or your own `THREE.Scene` | `{}` |
| `shadows` | `true` (PCFSoft) or `'basic' \| 'percentage' \| 'soft' \| 'variance'`, or `gl.shadowMap` props | `false` |
| `raycaster` | Props for the default raycaster | `{}` |
| `frameloop` | `'always' \| 'demand' \| 'never'` | `'always'` |
| `resize` | react-use-measure options | `{ scroll: true, debounce: { scroll: 50, resize: 0 } }` |
| `orthographic` | Use an orthographic camera | `false` |
| `dpr` | Pixel ratio, or a `[min, max]` range | `[1, 2]` |
| `legacy` | Disable `THREE.ColorManagement` | `false` |
| `linear` | Turn off automatic sRGB output | `false` |
| `flat` | Use `NoToneMapping` instead of ACESFilmic | `false` |
| `events` | Event manager factory `(state) => EventManager` | `events` export |
| `eventSource` | DOM element (or ref) that receives events | canvas parent |
| `eventPrefix` | `'offset' \| 'client' \| 'page' \| 'layer' \| 'screen'` | `'offset'` |
| `performance` | `{ current, min, max, debounce }` for regression | `{ min: 0.5, max: 1, debounce: 200 }` |
| `fallback` | DOM content shown if WebGL is unavailable | — |
| `onCreated` | `(state) => void` after the first render | — |
| `onPointerMissed` | Clicks that hit no object | — |

Changing `dpr`, `frameloop`, `performance` or `shadows` re-applies the new value. Re-rendering with equal values (including inline arrays and objects) keeps runtime changes made through `setDpr`, `setFrameloop` and similar setters.

## Renderers, ownership and WebGPU

| `gl` value | Who disposes it |
| --- | --- |
| omitted or a props object | R3F |
| a sync or async factory | R3F (the returned renderer) |
| a renderer instance | you (R3F releases render lists and loses the context, but doesn't call `dispose()`) |

```tsx
import * as THREE from 'three/webgpu'
import { Canvas, extend, type ThreeToJSXElements } from '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}
extend(THREE as any)

<Canvas
  gl={async (props) => {
    const renderer = new THREE.WebGPURenderer(props as any)
    await renderer.init()
    return renderer
  }}>
  <mesh>
    <meshBasicNodeMaterial />
    <boxGeometry />
  </mesh>
</Canvas>
```

## createRoot and tree-shaking

```tsx
import * as THREE from 'three'
import { extend, createRoot, events } from '@react-three/fiber'

extend(THREE as any) // or extend({ Mesh, BoxGeometry, ... }) for tree-shaking
const root = createRoot(document.querySelector('canvas')!)
await root.configure({ events, camera: { position: [0, 0, 50] } }) // await only needed for async gl
window.addEventListener('resize', () =>
  root.configure({ size: { width: innerWidth, height: innerHeight, top: 0, left: 0 } }),
)
window.dispatchEvent(new Event('resize'))
root.render(<App />)
// root.unmount()
```

`createRoot` doesn't resize itself or wire up events unless you pass `events`. `root.ready` is a promise (with a `status` field) that is pending while an async renderer is being created, and you can pass it to React's `use`. The `@react-three/babel` plugin generates the granular `extend` calls automatically.

## useThree state

`gl`, `scene`, `camera`, `raycaster`, `pointer` (normalized Vector2; `mouse` is deprecated), `clock`, `linear`, `flat`, `legacy`, `frameloop`, `performance { current, min, max, debounce, regress() }`, `size { width, height, top, left }` (pixels), `viewport { width, height, dpr, initialDpr, factor, distance, aspect, getCurrentViewport(camera?, target?, size?) }` (three.js units), `xr { connect, disconnect }`, `set`, `get`, `invalidate()`, `advance(timestamp, runGlobalEffects?)`, `setSize`, `setDpr`, `setFrameloop`, `setEvents`, `onPointerMissed`, `events { connected, handlers, connect(target), disconnect(), update() }`.

## Event data

```ts
{
  ...DomEvent, ...Intersection,   // point, distance, face, uv, instanceId, ...
  intersections: Intersection[],  // first hit per object, sorted by distance
  object: Object3D,               // what was hit
  eventObject: Object3D,          // what registered the handler
  unprojectedPoint: Vector3, ray: Ray, camera: Camera,
  sourceEvent: DomEvent, delta: number, // px between down and up
  stopPropagation(), target: { setPointerCapture, releasePointerCapture }
}
```

`pointerenter`/`pointerleave` behave like `over`/`out`. Out-type events with no current hit carry the previous intersection data.

Custom event manager:

```tsx
import { Canvas, events } from '@react-three/fiber'
<Canvas events={(state) => ({
  ...events(state),
  enabled: true,
  priority: 1,                    // higher layers go first and can stop lower ones
  filter: (hits, state) => hits,  // reorder or trim intersections
  compute: (event, state) => {
    state.pointer.set((event.offsetX / state.size.width) * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1)
    state.raycaster.setFromCamera(state.pointer, state.camera)
  },
})} />
```

## TypeScript

- Type refs explicitly: `useRef<THREE.Mesh>(null!)`. The `!` means you skip null checks in `useFrame` and effects.
- Element prop types: `ThreeElements['mesh']`, `ThreeElements['group']`, and so on. The v8 types `MeshProps` and friends were removed.
- Custom elements: `declare module '@react-three/fiber' { interface ThreeElements { foo: ThreeElement<typeof Foo> } }`, or skip declarations with `const Foo = extend(FooClass)`.
- Exported types: `RootState`, `CanvasProps`, `ThreeEvent<PointerEvent>`, `Intersection`, `Subscription`, `RenderCallback`, `EventManager`, `Events`, `Size`, `Viewport`, `Dpr`, `Performance`, `Camera`, `ThreeElement`, `ThreeElements`, `ThreeToJSXElements`.

## Additional exports

`addEffect`, `addAfterEffect`, `addTail` (global loop callbacks), `flushGlobalEffects`, `invalidate`, `advance`, `flushSync`, `extend`, `createPortal`, `createRoot`, `events`, `applyProps(instance, props)`, `buildGraph`, `useInstanceHandle`, `useGraph`. React's `act` is exported from `react`.

## v8 → v9 differences

- Requires React 19. `Props` became `CanvasProps`. `MeshProps` and similar became `ThreeElements['mesh']`. The `Node`/`Object3DNode`/`MaterialNode` types became `ThreeElement<typeof X>`.
- JSX declarations moved from `declare global { namespace JSX }` to `declare module '@react-three/fiber' { interface ThreeElements }`.
- The `gl` factory now receives constructor props, not the canvas: `gl={(props) => new WebGLRenderer(props)}`. It may be async.
- `useLoader` accepts a loader instance as well as a class.
- `extend(Class)` returns a component.
- Texture props are no longer converted to sRGB automatically. Built-in materials handle color textures. Custom shaders must set `colorSpace` themselves.
- StrictMode is inherited from the parent root, so don't redeclare it inside `<Canvas>`.
