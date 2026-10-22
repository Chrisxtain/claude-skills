// Helpers for liquid-glass-js. Load after container.js and button.js.
// Adapted from the demo's controls.js and demo.js.

const GLASS_UNIFORMS = {
  blurRadius: 'blurRadiusLoc',
  edgeIntensity: 'edgeIntensityLoc',
  rimIntensity: 'rimIntensityLoc',
  baseIntensity: 'baseIntensityLoc',
  edgeDistance: 'edgeDistanceLoc',
  rimDistance: 'rimDistanceLoc',
  baseDistance: 'baseDistanceLoc',
  cornerBoost: 'cornerBoostLoc',
  rippleEffect: 'rippleEffectLoc'
}

// Apply effect parameters to live instances. Unlike window.glassControls at
// construction time, this honours 0 values. Pass `instances` to target a subset.
function applyGlassParams(params, instances = Container.instances) {
  instances.forEach(instance => {
    const refs = instance.gl_refs
    if (!refs || !refs.gl) return
    const gl = refs.gl
    Object.entries(GLASS_UNIFORMS).forEach(([key, loc]) => {
      if (params[key] !== undefined && refs[loc]) gl.uniform1f(refs[loc], params[key])
    })
    if (params.warp !== undefined && refs.warpLoc) gl.uniform1f(refs.warpLoc, params.warp ? 1.0 : 0.0)
    if (params.tintOpacity !== undefined && refs.tintOpacityLoc) {
      instance.tintOpacity = params.tintOpacity
      gl.uniform1f(refs.tintOpacityLoc, params.tintOpacity)
    }
    if (instance.render) instance.render()
  })
}

// Re-capture the page behind the glass after the background changes
// (resize, new content, theme switch). Returns a promise.
function recaptureGlass() {
  Container.isCapturing = true
  return html2canvas(document.body, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    ignoreElements: el =>
      el.classList.contains('glass-container') ||
      el.classList.contains('glass-button') ||
      el.classList.contains('glass-button-text')
  })
    .then(snapshot => {
      Container.pageSnapshot = snapshot
      Container.isCapturing = false
      return new Promise(resolve => {
        const img = new Image()
        img.onload = () => {
          Container.instances.forEach(instance => {
            const refs = instance.gl_refs
            if (!refs || !refs.gl) return
            const gl = refs.gl
            gl.bindTexture(gl.TEXTURE_2D, refs.texture)
            if (instance instanceof Button && instance.parent && instance.isNestedGlass) {
              // Nested buttons sample their parent's canvas, so only resize the texture
              const parentCanvas = instance.parent.canvas
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, parentCanvas.width, parentCanvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
              gl.uniform2f(refs.textureSizeLoc, parentCanvas.width, parentCanvas.height)
              if (refs.containerSizeLoc) gl.uniform2f(refs.containerSizeLoc, instance.parent.width, instance.parent.height)
            } else {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
              gl.uniform2f(refs.textureSizeLoc, img.width, img.height)
            }
            if (instance.render) instance.render()
          })
          resolve()
        }
        img.src = snapshot.toDataURL()
      })
    })
    .catch(error => {
      Container.isCapturing = false
      console.error('liquid-glass recapture failed:', error)
    })
}

// Redraw standalone glass every frame, for glass that moves without scrolling
// (animations, draggable panels, position changes). Returns a stop function.
function animateGlass(instances = Container.instances) {
  let id
  const tick = () => {
    instances.forEach(i => i.render && !i.isNestedGlass && i.render())
    id = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(id)
}

// Best-effort teardown: the library has no destroy(). This removes the DOM
// node, drops the instance from the registry and releases its WebGL context.
// Standalone instances keep a no-op window scroll listener.
function destroyGlass(instance) {
  ;(instance.children || []).slice().forEach(destroyGlass)
  if (instance.parent) instance.parent.removeChild(instance)
  instance.element?.remove()
  const idx = Container.instances.indexOf(instance)
  if (idx > -1) Container.instances.splice(idx, 1)
  const gl = instance.gl_refs?.gl
  instance.gl_refs = {} // makes the render loops bail out
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
}
