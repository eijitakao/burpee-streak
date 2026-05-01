# Design Brief

**Burpee Streak** — Daily challenge tracker with social accountability via X. Energetic but focused. Warm amber accents for success and energy. Clean greyscale for clarity. Large readable streak counters. Japanese text support.

## Tone & Differentiation
Gamified motivation without chaos. Emphasis on streak visibility and daily action loop. Minimal decoration, high clarity.

## Color Palette

| Name            | OKLCH Values  | Purpose                           |
| --------------- | ------------- | --------------------------------- |
| Primary Accent  | 0.58 0.18 75  | Buttons, streak highlights        |
| Foreground      | 0.18 0.02 243 | Text, primary contrast            |
| Background      | 0.97 0.01 70  | Page background, subtle warmth    |
| Card            | 1.0 0 0       | User cards, elevated surfaces     |
| Muted           | 0.88 0.01 70  | Inactive states, secondary info   |
| Destructive     | 0.62 0.22 16  | Missed day, penalty warnings      |
| Border          | 0.92 0.01 70  | Dividers, subtle separation       |

## Typography
- **Display**: General Sans, bold weight, for streak numbers (impact on mobile)
- **Body**: General Sans, regular weight, for content and labels (scannability)
- **Mono**: JetBrains Mono, for codes and secondary data

## Structural Zones

| Zone         | Treatment                                 | Elevation |
| ------------ | ----------------------------------------- | --------- |
| Header       | bg-card, border-b, left-aligned title    | elevated  |
| Main Content | bg-background, centered user card        | standard  |
| Leaderboard  | bg-background, scrollable card list      | standard  |
| Actions      | Sticky footer or inline, primary accent  | floating  |
| Missed User  | bg-red-50 (light)/bg-red-950 (dark)      | standard  |

## Spacing & Rhythm
Mobile-first: 16px base unit. Ample vertical spacing (24px–32px) between sections. Card padding: 16px–20px. Button padding: 12px–16px.

## Component Patterns
- **Streak Card**: Large readable number (display font), user icon, Japanese text "#バーピー○日目"
- **Action Buttons**: Primary accent, full-width on mobile, rounded corners (12px)
- **Leaderboard Item**: Icon + username + streak + penalty, light red highlight if missed
- **User Input**: Clean input field for X username, centered on mobile

## Motion
Smooth transitions (0.3s cubic-bezier) on button hover, state changes. No entrance animations (focus on clarity over delight).

## Constraints
- No gradient backgrounds (clean, focused)
- No decorative shadows (functional only)
- 3-second readability on all text
- Support Japanese characters without fallback degradation

## Signature Detail
Centered streak counter card with large amber accent creates visual anchor. User icon above number emphasizes personalization without distraction.
