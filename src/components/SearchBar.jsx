import { useState, useEffect } from 'react';
import './SearchBar.css';

/**
 * Centered search input with premium, translucent styling.
 * Submits on Enter or button click.
 */
export default function SearchBar({ value, onSubmit, placeholder }) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    if (value !== undefined) setInputValue(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    onSubmit(trimmed || undefined);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <button type="submit" className="search-bar__btn" aria-label="Search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
      <input
        type="search"
        className="search-bar__input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search images"
        autoComplete="off"
      />
      
    </form>
  );
}
