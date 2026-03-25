import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import './ColorFilter.css';

const DEFAULT_PICKER_HEX = '#c4a8e8';

/** Normalize #RGB / #RRGGBB (optional leading #). Returns lowercase #rrggbb or null. */
function normalizeHex(raw) {
  if (raw == null || typeof raw !== 'string') return null;
  let s = raw.trim();
  if (!s) return null;
  if (!s.startsWith('#')) s = `#${s}`;
  const body = s.slice(1);
  if (!/^[0-9a-fA-F]{3}$/.test(body) && !/^[0-9a-fA-F]{6}$/.test(body)) return null;
  if (body.length === 3) {
    const r = body[0] + body[0];
    const g = body[1] + body[1];
    const b = body[2] + body[2];
    return `#${r}${g}${b}`.toLowerCase();
  }
  return s.toLowerCase();
}

/**
 * Color hint control: full hex picker (react-colorful).
 * selectedColor is a hex string (e.g. "#ec407a") or null when cleared.
 */
export default function ColorFilter({ selectedColor, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const [draftHex, setDraftHex] = useState(selectedColor || DEFAULT_PICKER_HEX);
  const [hexInput, setHexInput] = useState(
    (selectedColor || DEFAULT_PICKER_HEX).toUpperCase()
  );

  useEffect(() => {
    if (selectedColor) {
      setDraftHex(selectedColor);
      setHexInput(selectedColor.toUpperCase());
    } else {
      setDraftHex(DEFAULT_PICKER_HEX);
      setHexInput(DEFAULT_PICKER_HEX.toUpperCase());
    }
  }, [selectedColor]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePickerChange = (hex) => {
    setDraftHex(hex);
    setHexInput(hex.toUpperCase());
  };

  const commitHexInput = () => {
    const normalized = normalizeHex(hexInput);
    if (normalized) {
      setDraftHex(normalized);
      setHexInput(normalized.toUpperCase());
      onSelect(normalized);
    } else {
      setHexInput(draftHex.toUpperCase());
    }
  };

  const swatchStyle = selectedColor
    ? { background: selectedColor }
    : {
        backgroundImage: 'url("/filterplaceholder.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

  return (
    <div className="color-filter" ref={panelRef}>
      <button
        type="button"
        className="color-filter__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={selectedColor ? `Color hint: ${selectedColor}. Click to change.` : 'Open color picker'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="color-filter__trigger-swatch" style={swatchStyle} />
        <span className="color-filter__trigger-hex">{selectedColor ? selectedColor.toUpperCase() : 'Color'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="color-filter__panel" role="dialog" aria-label="Choose a color hint">
          <div className="color-filter__panel-header">
            <span>Color hint</span>
            {selectedColor && (
              <button
                type="button"
                className="color-filter__clear"
                onClick={() => {
                  onSelect(null);
                  setIsOpen(false);
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="color-filter__picker-wrap">
            <HexColorPicker color={draftHex} onChange={handlePickerChange} />
          </div>

          <div className="color-filter__hex-row">
            <span className="color-filter__hex-label">HEX</span>
            <input
              type="text"
              className="color-filter__hex-value color-filter__hex-input"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={commitHexInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitHexInput();
                }
              }}
              spellCheck={false}
              autoComplete="off"
              aria-label="Hex color value"
            />
          </div>

          <button
            type="button"
            className="color-filter__apply"
            onClick={() => {
              onSelect(draftHex);
              setIsOpen(false);
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
