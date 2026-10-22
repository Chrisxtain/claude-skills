# claude-skills

My Claude Code skills for building visually rich, interactive, responsive websites and apps.

| Skill | What it's for |
| --- | --- |
| [`react-three-fiber`](skills/react-three-fiber) | Interactive 3D scenes in React with React Three Fiber / three.js: models, lighting, animation, pointer events, and performance rules. |
| [`liquid-glass-js`](skills/liquid-glass-js) | Apple "Liquid Glass" refractive buttons, pills and panels. Bundles the library plus tested helpers (update, recapture, animate, destroy). |
| [`liquid-metal-logo`](skills/liquid-metal-logo) | Turns a logo or SVG into animated liquid chrome, using Paper's Apache-2.0 `LiquidMetal` shader (React or vanilla). |
| [`shadergradient`](skills/shadergradient) | Animated 3D mesh gradients for hero backgrounds (React, Next.js, Vue, Nuxt), including a fix for blank customizer-URL gradients. |
| [`scroll-world`](skills/scroll-world) | Scroll-driven "fly through the world" landing pages built from AI-generated scenes and video. Costs money to run (Monid and Higgsfield). |

## Install

### Claude Code on your computer, as a plugin (recommended)

```
/plugin marketplace add Chrisxtain/claude-skills
/plugin install design-skills@chrisxtain-skills
```

### Claude Code on your computer, as plain skills

```bash
git clone https://github.com/Chrisxtain/claude-skills.git
bash claude-skills/install.sh        # copies every skill into ~/.claude/skills
```

### Claude Code on the web (cloud sessions)

Cloud sessions start from a fresh container, so the skills have to be installed each time. Open the environment menu in the session title bar, choose **Edit**, and add this line to the **Setup script**:

```bash
curl -fsSL https://raw.githubusercontent.com/Chrisxtain/claude-skills/main/install.sh | bash
```

(This works when the repo is public. For a private repo, use the plugin route, or add this repo to the session and run `bash install.sh` from the clone.)

### Per project

Copy any skill folder into a project's `.claude/skills/` directory and it loads whenever Claude Code works in that project.

## Updating

Edit a skill under `skills/`, commit and push. Then run `/plugin marketplace update` or re-run `install.sh`.

## Credits and licenses

- `liquid-glass-js/assets/{container.js,button.js,glass.css}`: [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js), MIT (license included).
- `scroll-world`: [oso95/scroll-world](https://github.com/oso95/scroll-world) v0.8.0, MIT (license included). Local change: `references/pipeline.md` uses a portable file-size check, so it runs on Linux as well as macOS.
- `react-three-fiber` is condensed from the [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) docs (MIT).
- `liquid-metal-logo` builds on [@paper-design/shaders](https://github.com/paper-design/shaders) (Apache-2.0). It contains no code from paper-design/liquid-logo, which is licensed PolyForm Shield.
- `shadergradient` builds on [ruucm/shadergradient](https://github.com/ruucm/shadergradient) (MIT).
