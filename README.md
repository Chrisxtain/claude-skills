# claude-skills

My Claude Code skills for building visually rich, interactive, responsive websites and apps.

## Design direction and quality

| Skill | What it's for |
| --- | --- |
| [`design-taste-frontend`](skills/design-taste-frontend) | **Taste Skill v2.1** ([tasteskill.dev](https://tasteskill.dev)). Researched art directions from 247 award-gallery sites, real openly licensed photos, and a real-browser inspector that fails "AI slop" and loops on screenshots. Covers landing pages, product pages, dashboards and redesigns. A full build takes roughly 30–45 minutes. |
| [`web-design-guidelines`](skills/web-design-guidelines) | Vercel's Web Interface Guidelines review: audits UI code for accessibility, focus, forms, motion, typography and performance issues, reported as `file:line`. It fetches the latest rules each time it runs. |
| [`image-to-code`](skills/image-to-code) | Image-first workflow: generate design reference images, analyse them, then build the frontend to match. Written for Codex's built-in image generation. In Claude Code it needs an image-generation tool connected, and that may cost credits. |
| [`design-md-library`](skills/design-md-library) | 84 `DESIGN.md` design systems analysed from real sites (Apple, Stripe, Vercel, Linear, Airbnb, Notion…), with a catalogue to pick from. Use for "make it feel like X" or to give a project its own `DESIGN.md`. |
| [`playwright-cli`](skills/playwright-cli) | Microsoft's Playwright CLI: open pages, click and type, snapshot, screenshot, mock requests, record video, and generate tests. Requires the `playwright-cli` command (see Install). |

## Effects and techniques

| Skill | What it's for |
| --- | --- |
| [`react-three-fiber`](skills/react-three-fiber) | Interactive 3D scenes in React with React Three Fiber / three.js: models, lighting, animation, pointer events, and performance rules. |
| [`liquid-glass-js`](skills/liquid-glass-js) | Apple "Liquid Glass" refractive buttons, pills and panels. Bundles the library plus tested helpers (update, recapture, animate, destroy). |
| [`liquid-metal-logo`](skills/liquid-metal-logo) | Turns a logo or SVG into animated liquid chrome, using Paper's Apache-2.0 `LiquidMetal` shader (React or vanilla). |
| [`shadergradient`](skills/shadergradient) | Animated 3D mesh gradients for hero backgrounds (React, Next.js, Vue, Nuxt), including a fix for blank customizer-URL gradients. |
| [`scroll-world`](skills/scroll-world) | Scroll-driven "fly through the world" landing pages built from AI-generated scenes and video. Costs money to run (Monid and Higgsfield). |

## Install

### Claude Code on the web (cloud sessions)

Cloud sessions start from a fresh container. Open the environment menu in the session title bar, choose **Edit**, and add this line to the **Setup script**:

```bash
curl -fsSL https://raw.githubusercontent.com/Chrisxtain/claude-skills/main/install.sh | bash -s -- --with-tools
```

`--with-tools` also installs the `playwright-cli` command. Leave it off to install only the skills.

### Claude Code on your computer, as a plugin

```
/plugin marketplace add Chrisxtain/claude-skills
/plugin install design-skills@chrisxtain-skills
npm install -g @playwright/cli@latest     # for the playwright-cli skill
```

### Claude Code on your computer, as plain skills

```bash
git clone https://github.com/Chrisxtain/claude-skills.git
bash claude-skills/install.sh --with-tools
```

### Requirements by skill

- **design-taste-frontend:** Node 22+, plus Chrome, Edge or Chromium. Its image search needs network access to openverse.org, wikimedia.org, metmuseum.org, artic.edu, nasa.gov and archive.org.
- **playwright-cli:** Node 18+ and the `playwright-cli` command. By default it looks for Google Chrome.
- **web-design-guidelines:** network access to raw.githubusercontent.com.
- **image-to-code:** an image-generation tool.
- **scroll-world:** the Monid and Higgsfield CLIs, plus ffmpeg.

### Browser setup for cloud containers (optional, your decision)

Cloud containers run as root and ship Playwright's Chromium (`/opt/pw-browsers/chromium`), not Google Chrome. Chromium refuses to start as root unless its sandbox is disabled, so out of the box:

- `playwright-cli open` fails with "Chromium distribution 'chrome' is not found", then "Chromium sandboxing failed".
- taste-skill's `inspect.mjs` fails with "Running as root without --no-sandbox is not supported".

Both were tested to work in a cloud container with these settings:

```bash
export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium
export PLAYWRIGHT_MCP_SANDBOX=false
printf '#!/bin/sh\nexec /opt/pw-browsers/chromium --no-sandbox "$@"\n' > /usr/local/bin/chromium-nosandbox && chmod +x /usr/local/bin/chromium-nosandbox
export CHROME_PATH=/usr/local/bin/chromium-nosandbox
```

This turns off Chromium's process sandbox, a security layer, for browsers started in that container. The container itself stays isolated, but only enable this if you're comfortable with that and only browse sites you trust. These settings aren't applied automatically. Add them to the environment's setup script or environment variables yourself if you want them. On a normal desktop with Chrome installed, none of this is needed.

## Updating

Edit a skill under `skills/`, commit and push. Then run `/plugin marketplace update` or re-run `install.sh`.

## Credits and licenses

- `design-taste-frontend`: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) v2.1.4, MIT (license included). Unmodified.
- `image-to-code`: [Leonxlnx/imagegen-skills](https://github.com/Leonxlnx/imagegen-skills), MIT (license included). Unmodified. It moved there from taste-skill in v2.1.1.
- `web-design-guidelines`: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), MIT. Unmodified. The rules themselves live in [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) and are fetched at review time.
- `design-md-library`: the DESIGN.md files come from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), MIT (license included). The skill wrapper and catalogue are mine. The files are analyses "inspired by" each brand. Use them as style references, not to imitate those companies.
- `playwright-cli`: [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli), Apache-2.0 (license included). Unmodified.
- `liquid-glass-js/assets/{container.js,button.js,glass.css}`: [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js), MIT (license included).
- `scroll-world`: [oso95/scroll-world](https://github.com/oso95/scroll-world) v0.8.0, MIT (license included). Local change: `references/pipeline.md` uses a portable file-size check, so it runs on Linux as well as macOS.
- `react-three-fiber` is condensed from the [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) docs (MIT).
- `liquid-metal-logo` builds on [@paper-design/shaders](https://github.com/paper-design/shaders) (Apache-2.0). It contains no code from paper-design/liquid-logo, which is licensed PolyForm Shield.
- `shadergradient` builds on [ruucm/shadergradient](https://github.com/ruucm/shadergradient) (MIT).
