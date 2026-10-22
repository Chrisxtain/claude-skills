---
name: react-three-fiber
description: Write, debug and optimize 3D scenes with React Three Fiber (@react-three/fiber, R3F), the React renderer for three.js. Use whenever code imports @react-three/fiber, @react-three/drei or @react-three/test-renderer, renders a <Canvas>, uses useFrame/useThree/useLoader, or the user asks for a 3D scene, WebGL/WebGPU graphics, GLTF models, shaders or animations in React — even if they only say "three.js in React" or "3D component".
---

# React Three Fiber

R3F is a React renderer for three.js. JSX elements map 1:1 to three.js classes: `<mesh />` becomes `new THREE.Mesh()`, `<boxGeometry args={[1, 2, 3]} />` becomes `new THREE.BoxGeometry(1, 2, 3)`. Anything three.js can do, R3F can do. There is no wrapper layer to wait on, so when unsure about a prop, check the three.js docs for that class.

**Version pairing:** `@react-three/fiber@9` pairs with `react@19`, and `@8` pairs with `react@18`. Check `package.json` before writing code. These notes describe v9. For v8 projects, see the v9 differences in `references/api.md`.

```bash
npm install three @types/three @react-three/fiber
```

For deeper API detail (Canvas props, the full `useThree` state, event data, TypeScript, renderers/WebGPU, testing), read `references/api.md`.

## Minimal scene

```tsx
import { useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import type { Mesh } from 'three'

function Box(props: ThreeElements['mesh']) {
  const ref = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((_, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={Math.PI / 2} />
      <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
```

`<Canvas>` fills its parent, so the parent needs a size (for example `height: 100vh`). By default it creates a WebGLRenderer (antialias, alpha), a perspective camera at `[0, 0, 5]`, sRGB output, ACES tone mapping and `dpr={[1, 2]}`.

## Declaring objects

- **Constructor arguments go in `args`** as an array: `<sphereGeometry args={[1, 32, 32]} />`. If `args` change, the object is rebuilt from scratch.
- **Shorthands:** any property with `.set()` takes its arguments directly: `position={[1, 2, 3]}`, `color="hotpink"`. Properties with `.setScalar()` take a number: `scale={2}`.
- **Pierce nested properties with dashes:** `rotation-x={Math.PI / 2}`, `shadow-mapSize={[1024, 1024]}`, `material-uniforms-time-value={0}`.
- **Prefer declarative children over `new` in props.** `geometry={new THREE.BoxGeometry()}` creates a new object on every render. Use `<boxGeometry />` instead.
- **`attach`** binds a non-scene object to its parent. Materials attach to `material` and geometries to `geometry` automatically. Use explicit attaches for anything else: `attach="attributes-position"`, `attach="shadow-camera"`, `attach={`material-${i}`}` for multi-material arrays, or a function `(parent, self) => cleanup`.
- **`<primitive object={obj} />`** puts an existing object into the graph. One object can only be in the scene once, so clone it to reuse it. Primitives are **not** disposed for you.
- **`extend`** registers classes that aren't part of three core:
  ```tsx
  import { extend, type ThreeElement } from '@react-three/fiber'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  // v9 factory form: no global JSX types to declare, no name collisions
  const Controls = extend(OrbitControls)
  // or the catalogue form + TS augmentation:
  extend({ OrbitControls })
  declare module '@react-three/fiber' {
    interface ThreeElements { orbitControls: ThreeElement<typeof OrbitControls> }
  }
  ```
- **Disposal is automatic.** R3F calls `.dispose()` on unmounted objects. Put `dispose={null}` on an object or group to opt out, for example for shared or cached assets.

## Hooks (only inside `<Canvas>`)

Hooks rely on Canvas context. Calling `useThree` or `useFrame` in the component that *renders* `<Canvas>` crashes. Move that logic into a child component.

- **`useThree(selector?)`** returns the root state: `gl`, `scene`, `camera`, `size`, `viewport`, `pointer`, `clock`, `invalidate`, `set`, `get`, and more. Pass a selector to limit re-renders: `useThree((s) => s.camera)`. It is reactive only for root-state changes, not for three.js internals: `useThree((s) => s.camera.zoom)` will **not** update. Use `get()` for fresh state outside the render cycle.
- **`useFrame((state, delta, xrFrame) => {}, priority?)`** runs every frame before render. Keep it lean.
  - A **positive priority takes over rendering**: you must call `gl.render(scene, camera)` yourself. Use this for effect composers and HUDs. Callbacks run in ascending priority order.
  - A **negative priority** only orders callbacks. It does not take over rendering.
- **`useLoader(Loader | loaderInstance, url | urls, extensions?, onProgress?)`** suspends, so wrap it in `<Suspense>` with an error boundary. Results are cached by URL and shared across the tree. GLTF-style results also expose `{ nodes, materials }`. `useLoader.preload(GLTFLoader, url)` warms the cache. The third argument configures the loader, for example DRACO:
  ```tsx
  useLoader(GLTFLoader, url, (loader) => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(draco)
  })
  ```
  Don't mutate or dispose cached results that other components reuse. Clone them first.
- **`useGraph(object3d)`** returns a memoized `{ nodes, materials }` for any Object3D.

## Performance rules

These are the mistakes that matter most. Apply them by default.

1. **Never `setState` per frame or in fast events.** Mutate through refs inside `useFrame` or the handler instead:
   ```tsx
   // ❌ re-renders React 60×/s
   useFrame(() => setX((x) => x + 0.1))
   // ✅
   useFrame((_, delta) => (ref.current.position.x += delta))
   <mesh onPointerMove={(e) => (ref.current.position.x = e.point.x)} />
   ```
2. **Use `delta`**, not fixed increments, so speed doesn't depend on the refresh rate. Animate with `THREE.MathUtils.lerp`/`damp` in `useFrame`, or use `@react-spring/three` (`<a.mesh />`), which animates outside React.
3. **Don't bind fast-changing store state reactively.** Read it inside `useFrame`: `ref.current.position.x = useStore.getState().x`.
4. **Don't allocate in the loop.** Hoist `Vector3`, `Matrix4`, `Color` and similar objects to module scope or `useMemo`, then reuse them with `.set()`. The bundled `@react-three/eslint-plugin` (rules `no-new-in-loop`, `no-clone-in-loop`) flags these allocations.
   ```tsx
   const vec = new THREE.Vector3()
   useFrame(() => ref.current.position.lerp(vec.set(x, y, z), 0.1))
   ```
5. **Share geometries and materials.** Use one `useMemo`'d geometry and material for many meshes, or `<instancedMesh args={[undefined, undefined, count]}>` with `setMatrixAt` and `instanceMatrix.needsUpdate = true`. Every mesh is a draw call: aim for a few hundred, never thousands.
6. **Don't mount and unmount expensive subtrees to toggle them.** Each new material or light recompiles shaders. Prefer `visible={cond}`. Use `startTransition` for expensive state changes.
7. **Use `useLoader`** (or drei's `useGLTF`/`useTexture`), not `new TextureLoader().load()` in an effect, so assets are cached.
8. **For static scenes, set `frameloop="demand"`.** It renders only when props change. Call `invalidate()` after imperative mutations, such as controls' `change` events. To keep interaction smooth on weak devices, use `performance.regress()` with `performance.current` (or drei's `PerformanceMonitor` / `AdaptiveDpr`).
9. Many three.js changes need a flag or a method call to take effect: `material.needsUpdate`, `attribute.needsUpdate`, `camera.updateProjectionMatrix()`.

## Events

Meshes, lines and points support `onClick`, `onContextMenu`, `onDoubleClick`, `onWheel`, `onPointerDown`/`Up`/`Over`/`Out`/`Enter`/`Leave`/`Move` and `onPointerMissed`. `onUpdate(self)` fires when props are applied. `<Canvas onPointerMissed>` catches clicks that hit nothing.

- The event object carries the DOM event plus intersection data: `object`, `eventObject`, `point`, `distance`, `intersections`, `ray`, `camera`, `delta` and more.
- Events go to **every** intersected object, nearest first, and each one bubbles up its ancestors. Objects don't block what's behind them by default. Call `e.stopPropagation()` to make an object occlude the objects behind it. It must be in the handler, for example `onPointerOver`, even if you don't need the handler for anything else.
- Pointer capture works through `e.target.setPointerCapture(e.pointerId)` and `releasePointerCapture`.
- To share events with HTML overlays, use `<Canvas eventSource={containerRef} eventPrefix="client">`. Call `state.events.update()` to re-raycast when the camera moves without pointer input.

## Common recipes

- **GLTF models:** `npx gltfjsx model.glb --transform` generates a typed, reusable JSX component. Otherwise use `const { scene } = useLoader(GLTFLoader, url)` with `<primitive object={scene} />`, cloning the scene for multiple instances.
- **Textures:** `const map = useLoader(TextureLoader, url)` and then `<meshStandardMaterial map={map} />`. Built-in materials handle color space. Custom shaders need `texture.colorSpace = THREE.SRGBColorSpace` on color textures.
- **Shader uniforms:** R3F merges a new `uniforms` object into the material's existing one. Mutate `materialRef.current.uniforms.time.value` in `useFrame`, not your own memoized object.
- **Shadows:** set `<Canvas shadows>`, `castShadow` and `receiveShadow` on meshes, and adjust the light's shadow camera with `<orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />`.
- **Swapping the default camera:** `set({ camera })` from `useThree`, or drei's `<PerspectiveCamera makeDefault />`.
- **Portals / offscreen scenes:** `createPortal(children, targetScene)`.
- **Ecosystem:** `@react-three/drei` (controls, helpers, loaders, text, environment), `@react-three/postprocessing`, `@react-three/rapier` (physics), `@react-three/xr`, and `zustand` for state. Prefer an existing drei helper over hand-rolling one.

## Robustness

- Give `<Canvas fallback={<div>WebGL not supported</div>}>` a fallback, and wrap the canvas in an error boundary for context loss.
- Each `useLoader` subtree needs `<Suspense fallback={...}>`. Inside the canvas the fallback must be three JSX or `null`, not DOM.
- StrictMode from the parent `react-dom` root carries into the canvas in v9, so effects run twice in development. Make side effects (event listeners, controls) clean up after themselves.

## Testing

Use `@react-three/test-renderer`, which needs no WebGL:

```tsx
import ReactThreeTestRenderer from '@react-three/test-renderer'
const renderer = await ReactThreeTestRenderer.create(<Box />)
const mesh = renderer.scene.children[0]
expect(mesh.allChildren.length).toBe(2) // geometry + material
await renderer.fireEvent(mesh, 'click')
expect(mesh.props.scale).toBe(1.5)
await renderer.advanceFrames(2, 1) // step useFrame
```
