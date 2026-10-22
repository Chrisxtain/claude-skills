// Turn a shadergradient.co/customize URL into ShaderGradient props, layered over a
// preset so missing keys keep their defaults. In @shadergradient/react, control="query"
// does NOT fall back to defaults: any key absent from the URL renders a blank canvas.
import { presets } from '@shadergradient/react'

export function fromCustomizerUrl(url: string, base: Record<string, unknown> = presets.halo.props) {
  const query = url.includes('?') ? url.slice(url.indexOf('?') + 1) : url
  const props: Record<string, unknown> = { ...base }
  new URLSearchParams(query).forEach((raw, key) => {
    if (raw === 'true' || raw === 'false') props[key] = raw === 'true'
    else if (raw !== '' && Number.isFinite(Number(raw))) props[key] = Number(raw)
    else props[key] = raw
  })
  // Canvas-level settings belong on <ShaderGradientCanvas>, not <ShaderGradient>
  const { pixelDensity, fov, ...gradient } = props
  return { gradient, canvas: { pixelDensity, fov } as { pixelDensity?: number; fov?: number } }
}
