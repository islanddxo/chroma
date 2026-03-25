import { useEffect, useRef } from 'react';
import ImageCard from './ImageCard';
import './ImageGrid.css';

/**
 * Pinterest-style masonry grid of image cards.
 * Uses CSS columns for a clean masonry layout.
 */
export default function ImageGrid({
  images,
  isLoading,
  error,
  hasMore,
  onLoadMore,
  isEmpty,
  colorFallbackNotice,
}) {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (error) {
    return (
      <div className="image-grid__message image-grid__message--error">
        <p>{error}</p>
        <p className="image-grid__hint">
          Check your API key in <code>.env</code> and ensure it&apos;s valid.
        </p>
      </div>
    );
  }

  if (isEmpty && !isLoading) {
    return (
      <div className="image-grid__message image-grid__message--empty">
        <p>No results found. Try a different search or color.</p>
      </div>
    );
  }

  if (images.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="image-grid-wrapper">
      {colorFallbackNotice && (
        <p className="image-grid__fallback-notice" role="status">
          No strong color matches found — showing broader results.
        </p>
      )}
      <div className="image-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>

      {isLoading && (
        <div className="image-grid__loading">
          <div className="image-grid__spinner" aria-hidden="true" />
          <span>Loading...</span>
        </div>
      )}

      {hasMore && images.length > 0 && (
        <div ref={loadMoreRef} className="image-grid__load-more" aria-hidden />
      )}
    </div>
  );
}
