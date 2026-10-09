---
name: Hype CX 2027, Em Directo
description: A live broadcast of the customer's voice. Night studio, signal magenta, carrier violet.
colors:
  studio-ink: "#0b0912"
  studio-ink-raised: "#0f0c17"
  console-panel: "#17131f"
  paper: "#f3eef6"
  muted-paper: "#aaa3b9"
  signal-magenta: "#e0247a"
  signal-magenta-deep: "#b81a62"
  carrier-violet: "#5b3fd6"
  carrier-violet-light: "#a493ff"
typography:
  wordmark:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(4.4rem, 19.5vw, 22rem)"
    fontWeight: 800
    lineHeight: 0.8
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 50-150 driven by the signal, \"wght\" 300-900"
  display:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 5.5rem)"
    fontWeight: 720
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 112, \"wght\" 720"
  transcript:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(2.1rem, 5.2vw, 5rem)"
    fontWeight: 560
    lineHeight: 1.03
    fontVariation: "\"wdth\" 88, \"wght\" 560"
  body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "11px-15px"
    fontWeight: 500
    letterSpacing: "0.06em-0.12em"
rounded:
  lamp: "4px"
  media: "14px"
  control: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  bar: "64px"
  section: "clamp(80px, 12vh, 140px)"
components:
  button-signal:
    backgroundColor: "{colors.signal-magenta}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 1.3rem"
  button-signal-hover:
    backgroundColor: "{colors.signal-magenta-deep}"
  button-ghost:
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "48px"
  on-air-lamp:
    backgroundColor: "{colors.signal-magenta}"
    textColor: "#ffffff"
    rounded: "{rounded.lamp}"
    typography: "{typography.label}"
---

# Design System: Hype CX 2027, Em Directo

## Overview

**Creative North Star: "The Night Broadcast"**

The page is a radio broadcast of the customer's voice. The consumer speaks; the page makes you listen. Everything lives inside a night studio: an ink ground, one live signal in magenta, a violet carrier wave under it, and the paper-white voice of the type. Sections are stations on an FM dial (87.5 to 108). Moving between them is tuning, and tuning has a cost: a flash of static.

The display face is a variable font whose width axis is driven by the signal, so the name itself breathes with the voice. Photography stays out of tune (a magenta/violet duotone) until it is in view, then resolves to full colour out of noise.

**Key Characteristics:**
- One live signal: magenta is the "on air" state, never decoration.
- Type as voice: Anybody's width axis carries loudness; Geist carries reading; Geist Mono carries only frequencies and timecodes.
- Static as transition material: station changes, speaker changes and the first viewport all pass through noise.
- Real material only: 2026 photos, speakers, partners and agenda. 2027 facts are never invented.

## Colors

A dark studio with one hot signal and one cool carrier.

### Primary
- **Signal Magenta** (#e0247a): live state (ON AIR lamp, dial needle, active rundown segment, live voiceprint), primary actions, the oscilloscope line. Also the one full-colour block on the page: the tickets section.

### Secondary
- **Carrier Violet** (#5b3fd6): the carrier waves behind the signal, duotone shadows, one archive quote card. **Light Violet** (#a493ff) is its readable form for small text on ink (rundown segment type).

### Neutral
- **Studio Ink** (#0b0912): page ground. **Raised Ink** (#0f0c17): alternate sections (Voices, Archive). **Console Panel** (#17131f): form wells, media placeholders.
- **Paper** (#f3eef6): primary text. **Muted Paper** (#aaa3b9): secondary text (≥7:1 on ink). Hairlines are paper at 12% and 24% alpha.

### Named Rules
**The On Air Rule.** Magenta means live. If something is magenta, it is either the signal, the current state, or the action. Never a decorative tint.

**The Out of Tune Rule.** A photograph enters as a magenta/violet duotone (SVG filter `#duo`) and only shows its real colour once tuned in.

## Typography

**Display Font:** Anybody Variable (width 50 to 150, weight 100 to 900), self-hosted via Fontsource.
**Body Font:** Geist Variable.
**Label/Mono Font:** Geist Mono Variable, for frequencies, timecodes, ON AIR and section metadata only.

**Character:** a broadcast-graphics display face whose width stretches with loudness, paired with a calm, neutral reading face.

### Hierarchy
- **Wordmark** (800, clamp(4.4rem, 19.5vw, 22rem), 0.8): the hero only; width and weight are animated per letter by the signal.
- **Display** (720, wdth 112, clamp(2.6rem, 6vw, 5.5rem)): section headings.
- **Transcript** (560, wdth 88, clamp(2.1rem, 5.2vw, 5rem)): the spoken statement; words ink in on scroll.
- **Body** (400, 17px, 1.55): copy, max 56 to 60ch.
- **Label** (500 mono, 11 to 15px, uppercase, 0.06 to 0.12em): dial, timecodes, prices "Em breve".

### Named Rules
**The Loudness Rule.** Width is volume. Narrow means quiet or inactive (wdth 80 to 100); wide means speaking or selected (wdth 120 to 130). Hover and selection widen type rather than changing colour alone.

## Layout

Single column of stations inside a 1400px shell with a fluid gutter (16 to 56px). A fixed 64px broadcast bar carries the logo, the FM dial with station labels (above 1180px), a frequency readout button (below 1180px, opens a full-screen station sheet), the ON AIR lamp, the sound toggle and the tickets action. Each section is separated by a live signal rule that ends in the next station's frequency. Layout families never repeat: canvas hero, transcript, list plus sticky portrait, timeline rundown, horizontal reel, logo grid, ticket bands, sign-off. Below 900px every multi-column layout collapses to one column; the speakers become a snap carousel.

## Elevation & Depth

Flat. No shadows. Depth comes from light and signal: scanlines over photography, a duotone photo layer under the hero canvas, and full-screen static (screen blend) during tuning. Layer order: content, bar (50), tuning static (60), interference band (61), station sheet (70), skip link (100).

## Shapes

Three radii: 4px for lamps and small status tags, 14px for every media frame and quote card, full pill for every control (buttons, inputs, chips, sound toggle). Lines are 1px hairlines; the oscilloscope is 1 to 2.5px strokes.

## Components

- **Broadcast bar**: transparent over the hero, solid ink with a hairline once scrolled. The dial needle glides with `cubic-bezier(0.77, 0, 0.175, 1)` and pulses white on each tuning.
- **Buttons**: signal (magenta fill, white text), ghost (hairline, paper text, magenta border on hover). Press scales to 0.97. On the magenta tickets block, signal buttons become ink and ghost buttons fill white on hover.
- **Notify form ("Avisem-me")**: pill well with email field and signal button; composes an email to hypecx@targeting.ao; inline error and status messages.
- **Voice row**: name (wdth 88 → 122 when current), role and company, a seeded voiceprint that animates when live. Current row uses `aria-current`.
- **Tuned frame**: stacked duotone and colour layers; changing voice flashes noise for 300ms and resolves the colour layer from blur.
- **Rundown segment**: mono timecode, segment type in light violet, ON AIR tag and magenta node when centred; speaker chips tune the Voices section.
- **Signal rule**: 56px canvas, signal grows from flat at the left into the next station's frequency.

## Do's and Don'ts

- **Do** keep magenta for live state and actions only.
- **Do** run every new photo through the duotone and let it tune in.
- **Do** use the Loudness Rule for emphasis instead of new colours.
- **Do** honour `prefers-reduced-motion`: static wave, no static flashes, no transcript reveal.
- **Don't** add eyebrows or kickers above headings; the dial already says where you are.
- **Don't** use mono for anything that is not a frequency, a time or a status.
- **Don't** invent 2027 dates, venue, prices, speakers or attendance numbers.
- **Don't** use em-dashes in copy.
