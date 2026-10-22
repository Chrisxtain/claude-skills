---
name: design-md-library
description: Library of 84 ready-made DESIGN.md design systems analysed from real sites (Apple, Stripe, Vercel, Linear, Airbnb, Notion, Spotify, Tesla, Claude, Supabase, Figma, Nike, SpaceX and more), each with colour tokens, type scale, spacing, radii, shadows, components and do's/don'ts. Use when the user wants a site or app to look "like <brand>" or in a named company's style, asks for a DESIGN.md or design system for their project, wants a consistent visual language picked from real-world references, or says "use awesome-design-md / getdesign.md".
---

# DESIGN.md library

From [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT). A `DESIGN.md` is a plain-text design system, a format introduced by Google Stitch. It is YAML tokens (colours, typography, spacing, radii) followed by prose on layout, elevation, components and do's/don'ts. Building from one keeps every screen in a single visual language.

All 84 files are in `references/<id>/DESIGN.md`. Each is 300–900 lines, so **read only the one or two you need**.

## How to use it

1. **Pick a system.** If the user names a brand ("make it feel like Linear"), use that one. Otherwise match the brief against the catalogue below (industry, mood, light or dark, editorial or product) and suggest 2–3 options with a one-line reason each. Let the user choose when the choice matters.
2. **Read the whole file** before writing any code. The tokens alone aren't enough: the Layout, Components and Do's/Don'ts sections carry the character.
3. **Turn the tokens into code first:** CSS custom properties (or a Tailwind theme / `theme.ts`) for colours, the type scale, spacing, radii and shadows. Then build components that only use those tokens.
4. **Copy it into the project** as `DESIGN.md` at the root, adapted for the user's brand, so later sessions and agents stay consistent.
5. **Check the result** in a browser at desktop and phone widths (the `playwright-cli` skill or `design-taste-frontend`'s inspector) against the file's do's and don'ts.

## Rules

- **Take inspiration, don't impersonate.** Use the *system* (proportions, rhythm, palette logic, type pairing, component shapes) for the user's own brand. Never copy another company's logo, name, wordmark, product imagery or copy, and never build anything that could pass as that company's site.
- **Proprietary fonts** (SF Pro, Circular, Geist Mono variants, Söhne, brand-custom faces) may not be licensed for the user. Substitute an open font with the same character and say so. For example: Inter or Geist for neo-grotesques, Fraunces or Newsreader for editorial serifs, JetBrains Mono or IBM Plex Mono for monospace.
- **Swap brand colours** for the user's own while keeping the system's *structure* (one accent, neutrals ramp, semantic colours). Recheck contrast to WCAG AA afterwards.
- **Mixing two systems:** take tokens from one and layout ideas from the other, never two palettes or two type systems at once.
- **Ask which style to use if unsure:** if `design-taste-frontend` is also installed and the user hasn't named a reference style, ask whether they want a researched art direction (taste) or a known brand's system (this library), rather than running both.

## Catalogue

| id | Character |
| --- | --- |
| `1win` | a near-black crypto casino and sportsbook built on Inter at heavy weights, where a vivid green action color and an electric blue secondary carry… |
| `airbnb` | A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries every… |
| `airtable` | A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signature… |
| `aljazeera` | a hard-news editorial system built on flat white paper and dense Roboto headline stacks, signed by one saturated orange used as logo block and… |
| `apple` | A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by… |
| `binance` | A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary CTA,… |
| `bmw` | BMW's corporate site — distinct from BMW M's motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On a… |
| `bmw-m` | A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE. The… |
| `bugatti` | An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive… |
| `cal` | A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The system… |
| `claude` | A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines, warm… |
| `clay` | A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTAs,… |
| `clickhouse` | A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in confident… |
| `cohere` | Cohere's 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, soft… |
| `coinbase` | An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is pure… |
| `composio` | A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single… |
| `cursor` | An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (#f7f7f4)… |
| `dell-1996` | a catalog-era enterprise web design built around a literal black page frame, vivid flat color-block "ribbon cards" tinted in sage, salmon,… |
| `dji` | a product-photography showroom for drones and cameras, where full-bleed studio renders sit in square, gutter-separated tiles on a white canvas,… |
| `elevenlabs` | A voice-AI brand whose marketing surfaces read like a quietly editorial print magazine. The base canvas is off-white (#f5f5f5) holding warm… |
| `expo` | A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white with a… |
| `ferrari` | A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is **near-black** (#181818) holding pure white… |
| `figma` | A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome… |
| `framer` | A confident dark-canvas builder marketing site that treats the page like a working artboard — pure black surfaces, white display type set in GT… |
| `hashicorp` | An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors — Terraform… |
| `hp` | a white-paper enterprise-consumer system anchored by HP Electric Blue (#024ad8) as the lone signal CTA, near-black ink (#1a1a1a) for headlines,… |
| `ibm` | An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident accent,… |
| `intercom` | An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom's proprietary… |
| `jobright` | an AI job-hunting platform built on an energetic spring-mint green against black and white, with pale-mint section bands carrying the page rhythm.… |
| `kraken` | Kraken's website is a clean, trustworthy crypto exchange that uses purple as its commanding brand color. The design operates on white backgrounds… |
| `lamborghini` | Lamborghini's website is a cathedral of darkness — a digital stage where jet-black surfaces stretch infinitely and every element emerges from the… |
| `linear.app` | A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text… |
| `lovable` | Lovable's website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned background (#f7f4ed) that immediately… |
| `mastercard` | Mastercard's experience reads like a warm, editorial magazine built from soft stone and signal orange. The canvas is a muted putty-cream (#F3F0EE)… |
| `mercury` | a fintech system that moves between a deep ink-violet night world on the homepage and a pale, near-white light world on its product and pricing… |
| `meta` | Meta's design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising voice.… |
| `minimax` | MiniMax presents itself as a premium AI infrastructure brand through a striking duality — bold black-pill CTAs and stark white canvas for… |
| `mintlify` | Mintlify presents documentation infrastructure with a dual-mode aesthetic — atmospheric sky-gradient marketing heroes (cloud illustration… |
| `miro` | Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice — anchored by its signature canary yellow… |
| `mistral.ai` | Mistral AI brands itself with a singular signature — atmospheric sunset gradients (mustard, orange, deep red) layered over photography of… |
| `mongodb` | MongoDB carries a strong dual-mode visual identity — dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired with… |
| `mydealz` | a high-density German deals-community system built on a confident brand green, where a stacked white-card feed carries thousands of deals and… |
| `nerdwallet` | a personal-finance comparison platform built almost entirely from one deep green and a ladder of mints beneath it. Editorial pages open on a green… |
| `nike` | / |
| `nintendo-2001` | a brushed-periwinkle "console chrome" interface where every panel is a beveled metal plate, navigation glows amber over a halftone-dotted carbon… |
| `notion` | Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice — anchored by a deep navy hero band… |
| `nvidia` | / |
| `ollama` | / |
| `opencode.ai` | / |
| `oracle` | an enterprise system built on a warm neutral ladder rather than a colour palette. Six numbered greys carry almost every surface, a single dark… |
| `oura` | a warm-paper wellness system that pairs a high-contrast Editorial serif with a quiet grotesque sans, wraps every surface in a cream-and-earth… |
| `pinterest` | / |
| `playstation` | / |
| `posthog` | / |
| `raycast` | / |
| `renault` | / |
| `replicate` | / |
| `resend` | / |
| `revolut` | / |
| `runwayml` | Runway's interface is a cinematic reel brought to life as a website — a dark, editorial, film-production-grade design where full-bleed photography… |
| `sanity` | Sanity's website is a developer-content platform rendered as a nocturnal command center -- dark, precise, and deeply structured. The entire… |
| `sap` | an enterprise system that keeps almost everything on white and spends its structure on two greys and one blue. The chrome is deliberately quiet, a… |
| `sentry` | a developer-tools brand built on a deep purple-violet midnight canvas, electric lime accents, and a slightly subversive illustrated personality.… |
| `shopify` | a cinematic commerce platform that runs two parallel design tracks. The marketing-hero and product-narrative pages live on near-black canvases… |
| `slack` | a workplace messaging brand built on a deep aubergine primary, with cream-lavender hero gradients, blue inline links, and pill CTAs. The system… |
| `spacex` | a mission-oriented aerospace brand built on pure black canvas, full-bleed photographic and video heroes of rockets and Mars landscapes, and… |
| `spotify` | Spotify's web interface is a dark, immersive music player that wraps listeners in a near-black cocoon (#121212, #181818, #1f1f1f) where album art… |
| `starbucks` | Starbucks' design system is a **warm, confident retail flagship** wearing the green of their storefront apron across every surface. The canvas… |
| `stripe` | a financial-infrastructure brand built on a deep navy ink, an electric indigo primary, and a recurring atmospheric gradient mesh that occupies the… |
| `supabase` | an open-source database platform built on a clean white-and-near-black system with a single signature emerald-green CTA, a custom humanist sans… |
| `superhuman` | a fast-email productivity brand split between an editorial dark hero (deep indigo navy with violet-sky atmospheric backdrop and a portrait… |
| `tesla` | Tesla's website is an exercise in radical subtraction — a digital showroom where the product is everything and the interface is almost nothing.… |
| `theverge` | The Verge's 2024 redesign feels like somebody wired a Condé Nast magazine to a chiptune soundboard. The canvas is almost-black (#131313), the… |
| `together.ai` | an AI infrastructure platform whose surface alternates between near-black hero bands (with a three-color orange-magenta-periwinkle gradient as the… |
| `uber` | a transportation-and-delivery super-app brand whose web surface is a black-and-white duet, framed by a custom geometric display sans, accented by… |
| `vercel` | a developer-platform brand whose surface is a stark black-and-ink duet on near-white canvas, broken at hero scale by a multi-color mesh gradient… |
| `vodafone` | a telecom super-brand whose web surface alternates between editorial photography hero bands with massive uppercase display headlines and clean… |
| `voltagent` | a developer-focused AI agent engineering platform whose surface is an unrelenting near-black canvas broken only by a single electric-green brand… |
| `warp` | an agentic terminal-and-development-environment brand whose surface is a warm near-charcoal canvas (a tint warmer than pure black), broken only by… |
| `webflow` | a visual web development platform whose surface contrasts a deep near-black #080808 primary against a generous white canvas, broken by a five-stop… |
| `wired` | a flagship technology-magazine brand whose surface is a strict editorial duet of stark black wordmark on white canvas, anchored by a tall narrow… |
| `wise` | a global money-transfer brand whose surface combines an unusually heavy near-black display sans (weight 900 at 64–126 px) with a vivid lime-green… |
| `x.ai` | Elon Musk's frontier-AI company whose web surface is a strict near-black canvas broken only by white pill outlines, occasional warm sunset / dusk… |
| `zapier` | a workflow-automation platform whose surface combines warm-cream neutrals (#fffefb canvas, #f8f4f0 soft cream) with deep coffee ink (#201515) and… |

## Updating

Upstream adds files regularly. Some brands' full files have moved to [getdesign.md](https://getdesign.md). To refresh, copy `design-md/<id>/DESIGN.md` from a new clone of the upstream repo into `references/<id>/` and add a catalogue row.
