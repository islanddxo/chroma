import SearchBar from './SearchBar';
import ColorFilter from './ColorFilter';
import ThemeToggle from './ThemeToggle';
import './Header.css';

/**
 * Main header with logo, search, color filter, and theme toggle.
 */
export default function Header({
  searchQuery,
  onSearchSubmit,
  selectedColor,
  onColorSelect,
  theme,
  onThemeToggle,
  onLogoClick,
}) {
  return (
    <header className="header" role="banner">
      <button
        type="button"
        className="header__logo header__logo-btn"
        onClick={onLogoClick}
        aria-label="Go to home and reset search"
      >
        <img width="28" height="28" src="/logo.svg" alt="" className="header__logo-mark" />
        
      </button>

      <div className="header__center">
        <SearchBar
          value={searchQuery}
          onSubmit={onSearchSubmit}
          placeholder="Search Chroma..."
        />
      </div>

      <div className="header__actions">
        <ColorFilter
          selectedColor={selectedColor}
          onSelect={onColorSelect}
        />
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
