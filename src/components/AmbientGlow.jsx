import { hexToGlowRgba } from '../utils/colorMapping';
import './AmbientGlow.css';

const DEFAULT_GLOW = 'rgba(236, 64, 122, 0)';

/**
 * Soft blurred ambient glow at the bottom of the viewport.
 * Uses the user's selected hex when set; otherwise a soft pink default.
 */
export default function AmbientGlow({ selectedColorHex }) {
  const glowColor = selectedColorHex ? hexToGlowRgba(selectedColorHex, 0.85) : DEFAULT_GLOW;

  return (
    <div className="ambient-glow" aria-hidden="true">
      <div
        className="ambient-glow__gradient"
        style={{ '--glow-color': glowColor }}
      />
    </div>
  );
}
