/**
 * Map hex colors to Unsplash's named color categories using HSL rules.
 * More perceptually stable than RGB distance for muted / earthy tones.
 */

/**
 * Parse #RGB or #RRGGBB to [r, g, b] in 0–255.
 */
export function hexToRgb(hex) {
  const s = String(hex).trim().replace('#', '');
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return [r, g, b];
  }
  if (s.length === 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return [128, 128, 128];
    return [r, g, b];
  }
  return [128, 128, 128];
}

/**
 * Convert sRGB to HSL. Hue in [0, 360), saturation and lightness in [0, 1].
 */
export function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

export function hexToHsl(hex) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Map a hex color to a logical name (red, orange, …) used for Unsplash + search hints.
 * Order matters: black / white / brown first, then hue wedges.
 */
export function mapHexToUnsplashColor(hex) {
  const { h, s, l } = hexToHsl(hex);

  // Near black / white (lightness-driven)
  if (l < 0.11) return 'black';
  if (l > 0.92 && s < 0.15) return 'white';
  if (l > 0.96) return 'white';

  // Muted warm earth tones (brown), not greens — e.g. #7d5a3f
  const warmHue = (h >= 0 && h <= 70) || h >= 330;
  if (s < 0.38 && l >= 0.12 && l <= 0.52 && warmHue) {
    return 'brown';
  }

  // Hue-based families (muted greens like #51914f map here with h ~ 120°)
  if (h < 18 || h >= 345) return 'red';
  if (h < 45) return 'orange';
  if (h < 72) return 'yellow';
  if (h < 165) return 'green';
  if (h < 255) return 'blue';
  if (h < 290) return 'purple';
  if (h < 345) return 'pink';
  return 'red';
}

/**
 * Maps logical names to Unsplash API `color` query values.
 */
export function unsplashNamedColorToApiParam(name) {
  const map = {
    red: 'red',
    orange: 'orange',
    yellow: 'yellow',
    green: 'green',
    blue: 'blue',
    purple: 'purple',
    pink: 'magenta',
    brown: 'orange',
    black: 'black',
    white: 'white',
  };
  return map[name] ?? 'red';
}

/** Build a soft rgba for ambient glow from a hex color */
export function hexToGlowRgba(hex, alpha = 0.45) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
