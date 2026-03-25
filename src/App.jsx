import { useState, useEffect, useCallback, useRef } from 'react';
import { searchPhotos } from './api/unsplash';
import { DEFAULT_SEARCH_QUERY, THEME_STORAGE_KEY } from './constants';
import { mapHexToUnsplashColor, unsplashNamedColorToApiParam } from './utils/colorMapping';
import { buildColorSearchAttempts } from './utils/colorSearch';
import Header from './components/Header';
import ThemeMenu from './components/ThemeMenu';
import ImageGrid from './components/ImageGrid';
import AmbientGlow from './components/AmbientGlow';
import './App.css';

/**
 * Tracks the winning query + API color param for pagination (load more).
 * `color` is the Unsplash `color` param value, or undefined if results were unfiltered.
 */
function createPaginationSnapshot() {
  return { query: DEFAULT_SEARCH_QUERY, color: undefined };
}

/**
 * Chroma - Visual discovery app with Unsplash integration.
 */
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(DEFAULT_SEARCH_QUERY);
  /** True after the user submits the search form at least once (not the initial load). */
  const [hasUserSubmittedSearch, setHasUserSubmittedSearch] = useState(false);
  /** Selected UI / glow color — hex string or null */
  const [selectedColorHex, setSelectedColorHex] = useState(null);
  /** Active theme selection for UI underline (kept separate from submittedQuery). */
  const [activeTheme, setActiveTheme] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  /** Shown when we had to skip strict color matching and use a broader request */
  const [colorFallbackNotice, setColorFallbackNotice] = useState(false);

  const paginationRef = useRef(createPaginationSnapshot());

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchImages = useCallback(
    async (pageNum, append = false) => {
      const q = (submittedQuery && submittedQuery.trim()) || DEFAULT_SEARCH_QUERY;
      setLoading(true);
      setError(null);

      try {
        let result;

        if (!selectedColorHex) {
          paginationRef.current = { query: q, color: undefined };
          setColorFallbackNotice(false);
          result = await searchPhotos({ query: q, page: pageNum, color: undefined });
        } else if (pageNum === 1) {
          const mappedName = mapHexToUnsplashColor(selectedColorHex);
          const colorParam = unsplashNamedColorToApiParam(mappedName);
          const attempts = buildColorSearchAttempts({
            submittedQuery,
            hasUserSubmittedSearch,
            mappedName,
            colorParam,
          });

          let lastEmpty = null;
          let fallbackUsed = false;

          for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            const res = await searchPhotos({
              query: attempt.query,
              page: pageNum,
              color: attempt.color,
            });
            lastEmpty = res;

            if (res.results.length > 0) {
              result = res;
              paginationRef.current = { query: attempt.query, color: attempt.color };
              fallbackUsed = i > 0;
              break;
            }
          }

          if (!result) {
            result = lastEmpty;
            if (attempts.length) {
              paginationRef.current = {
                query: attempts[0].query,
                color: attempts[0].color,
              };
            }
          }

          setColorFallbackNotice(Boolean(fallbackUsed && result?.results?.length > 0));
        } else {
          const { query: pq, color: pc } = paginationRef.current;

          if (pc) {
            const withTry = await searchPhotos({ query: pq, page: pageNum, color: pc });
            if (withTry.results.length > 0) {
              result = withTry;
            } else {
              result = await searchPhotos({ query: pq, page: pageNum, color: undefined });
            }
          } else {
            result = await searchPhotos({ query: pq, page: pageNum, color: undefined });
          }
        }

        if (append) {
          setImages((prev) => [...prev, ...result.results]);
        } else {
          setImages(result.results);
        }

        setHasMore(result.results.length > 0 && pageNum * 20 < result.total);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setImages([]);
        setHasMore(false);
        setColorFallbackNotice(false);
      } finally {
        setLoading(false);
      }
    },
    [submittedQuery, selectedColorHex, hasUserSubmittedSearch]
  );

  useEffect(() => {
    setPage(1);
    fetchImages(1, false);
  }, [submittedQuery, selectedColorHex, fetchImages]);

  const handleSearchSubmit = useCallback((query) => {
    const q = query?.trim() || DEFAULT_SEARCH_QUERY;
    setHasUserSubmittedSearch(true);
    setActiveTheme(null);
    setSubmittedQuery(q);
    setSearchQuery(q);
    setPage(1);
  }, []);

  const handleLogoClick = useCallback(() => {
    setHasUserSubmittedSearch(false);
    setActiveTheme(null);
    setSelectedColorHex(null);
    setColorFallbackNotice(false);
    setSubmittedQuery(DEFAULT_SEARCH_QUERY);
    setSearchQuery('');
    setPage(1);
  }, []);

  const handleThemeSelect = useCallback((themeQuery) => {
    setHasUserSubmittedSearch(true);
    setSubmittedQuery(themeQuery);
    // Theme acts as a hidden search context; keep input empty for a cleaner UX.
    setSearchQuery('');
    setActiveTheme(themeQuery);
    setPage(1);
  }, []);

  const handleColorSelect = useCallback((hexOrNull) => {
    setSelectedColorHex(hexOrNull);
    // Color picker interaction clears theme context and hides the theme menu.
    setActiveTheme(null);
    setPage(1);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, true);
  }, [page, fetchImages]);

  const isEmpty = !loading && images.length === 0 && !error;

  return (
    <div className="app">
      <AmbientGlow selectedColorHex={selectedColorHex} />

      <Header
        searchQuery={searchQuery}
        onSearchSubmit={handleSearchSubmit}
        selectedColor={selectedColorHex}
        onColorSelect={handleColorSelect}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onLogoClick={handleLogoClick}
      />

      {!selectedColorHex && (
        <ThemeMenu activeQuery={activeTheme} onSelectTheme={handleThemeSelect} />
      )}

      <main className="app__main">
        <ImageGrid
          images={images}
          isLoading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          isEmpty={isEmpty}
          colorFallbackNotice={colorFallbackNotice}
        />
      </main>
    </div>
  );
}
