// Vanilla (no React) liquid-metal logo mount for @paper-design/shaders (Apache-2.0).
//   import { mountLiquidMetal } from './liquid-metal.js'
//   const lm = await mountLiquidMetal(el, '/logo.svg', { colorTint: '#9ad' })
//   lm.set({ repetition: 4 }); lm.mount.setSpeed(0); lm.dispose()
import {
  ShaderMount,
  liquidMetalFragmentShader,
  toProcessedLiquidMetal,
  getShaderColorFromString,
  LiquidMetalShapes,
  ShaderFitOptions,
  defaultObjectSizing,
} from '@paper-design/shaders'

// Same values as the React component's defaultPreset
export const defaults = {
  colorBack: '#00000000', // transparent; the preset uses '#AAAAAC'
  colorTint: '#ffffff',
  repetition: 2,
  softness: 0.1,
  shiftRed: 0.3,
  shiftBlue: 0.3,
  distortion: 0.07,
  contour: 0.4,
  angle: 70,
  speed: 1,
  ...defaultObjectSizing,
  scale: 0.6,
}

function toUniforms(o) {
  return {
    u_colorBack: getShaderColorFromString(o.colorBack),
    u_colorTint: getShaderColorFromString(o.colorTint),
    u_repetition: o.repetition,
    u_softness: o.softness,
    u_shiftRed: o.shiftRed,
    u_shiftBlue: o.shiftBlue,
    u_distortion: o.distortion,
    u_contour: o.contour,
    u_angle: o.angle,
    u_fit: ShaderFitOptions[o.fit],
    u_scale: o.scale,
    u_rotation: o.rotation,
    u_offsetX: o.offsetX,
    u_offsetY: o.offsetY,
    u_originX: o.originX,
    u_originY: o.originY,
    u_worldWidth: o.worldWidth,
    u_worldHeight: o.worldHeight,
  }
}

// The shader treats only transparent pixels as background. Logos on a solid
// white (or any flat) background must be keyed out first or they render as a
// metal rectangle. Returns an object URL of a PNG with that colour removed.
export async function keyOutBackground(src, { color = [255, 255, 255], tolerance = 24 } = {}) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = src
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, c.width, c.height)
  const d = data.data
  const t2 = tolerance * tolerance
  for (let i = 0; i < d.length; i += 4) {
    const dr = d[i] - color[0], dg = d[i + 1] - color[1], db = d[i + 2] - color[2]
    if (dr * dr + dg * dg + db * db <= t2) d[i + 3] = 0
  }
  ctx.putImageData(data, 0, 0)
  const blob = await new Promise(r => c.toBlob(r, 'image/png'))
  return URL.createObjectURL(blob)
}

export async function mountLiquidMetal(el, src, options = {}) {
  let opts = { ...defaults, ...options }
  const { pngBlob } = await toProcessedLiquidMetal(src) // Poisson bevel, runs on the main thread
  const img = new Image()
  img.src = URL.createObjectURL(pngBlob)
  await img.decode()
  const mount = new ShaderMount(
    el,
    liquidMetalFragmentShader,
    { ...toUniforms(opts), u_image: img, u_isImage: true, u_shape: LiquidMetalShapes.none },
    undefined,
    opts.speed,
    0,
    2,
    undefined,
    ['u_image']
  )
  return {
    mount,
    set(next) {
      opts = { ...opts, ...next }
      mount.setUniforms(toUniforms(opts))
      if ('speed' in next) mount.setSpeed(next.speed)
    },
    dispose() {
      mount.dispose()
      URL.revokeObjectURL(img.src)
    },
  }
}
