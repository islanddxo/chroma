import { useEffect, useRef, useState } from 'react';
import { THEME_MENU_ITEMS } from '../constants';
import './ThemeMenu.css';

/**
 * Horizontal theme shortcuts below the header.
 * Keeps the search input untouched; theme is used as a hidden search context.
 */
export default function ThemeMenu({ activeQuery, onSelectTheme }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const normalize = (v) => (v ? String(v).trim().toLowerCase() : '');
  const activeNorm = normalize(activeQuery);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return undefined;

    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollByDir = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(200, el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <nav className="theme-menu" aria-label="Browse by theme">
      <div className="theme-menu__row">
        <button
          type="button"
          className="theme-menu__arrow"
          aria-label="Scroll themes left"
          onClick={() => scrollByDir(-1)}
          style={{ visibility: canScrollLeft ? 'visible' : 'hidden' }}
        >
          ‹
        </button>

        <div ref={scrollRef} className="theme-menu__scroll">
          <ul className="theme-menu__list">
            {THEME_MENU_ITEMS.map(({ label, query }) => {
              const isActive = normalize(query) === activeNorm;
              return (
                <li key={query} className="theme-menu__item">
                  <button
                    type="button"
                    className={`theme-menu__btn ${isActive ? 'theme-menu__btn--active' : ''}`}
                    onClick={() => onSelectTheme(query)}
                    aria-pressed={isActive}
                  >
                    <span className="theme-menu__label">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          className="theme-menu__arrow"
          aria-label="Scroll themes right"
          onClick={() => scrollByDir(1)}
          style={{ visibility: canScrollRight ? 'visible' : 'hidden' }}
        >
          ›
        </button>
      </div>
    </nav>
  );
}
