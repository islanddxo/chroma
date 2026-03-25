import { DEFAULT_SEARCH_QUERY } from '../constants';

/**
 * Build ordered search attempts for Unsplash: color param + query hints.
 * Each attempt is a single API call (query + optional color filter).
 */

/**
 * Primary text for a query when a color hint is active.
 * - Before first user search: "{mappedName} aesthetic mood board"
 * - After user search: "{mappedName} {userQuery}" unless the query already leads with that color word.
 */
export function buildPrimaryHintQuery(submittedQuery, hasUserSubmittedSearch, mappedName) {
  const trimmed = (submittedQuery || '').trim() || DEFAULT_SEARCH_QUERY;

  if (!hasUserSubmittedSearch) {
    return `${mappedName} aesthetic`;
  }

  const lower = trimmed.toLowerCase();
  const prefix = `${mappedName.toLowerCase()} `;
  if (lower === mappedName.toLowerCase() || lower.startsWith(prefix)) {
    return trimmed;
  }
  return `${mappedName} ${trimmed}`;
}

/**
 * Ordered attempts: strict color → hint without color → plain user query (if different).
 * Deduplicates identical {query, color} pairs.
 */
export function buildColorSearchAttempts({
  submittedQuery,
  hasUserSubmittedSearch,
  mappedName,
  colorParam,
}) {
  const primaryText = buildPrimaryHintQuery(submittedQuery, hasUserSubmittedSearch, mappedName);
  const trimmedUser = (submittedQuery || '').trim() || DEFAULT_SEARCH_QUERY;

  const raw = [
    { query: primaryText, color: colorParam },
    { query: primaryText, color: undefined },
  ];

  if (hasUserSubmittedSearch && primaryText !== trimmedUser) {
    raw.push({ query: trimmedUser, color: undefined });
  }

  if (!hasUserSubmittedSearch && primaryText !== DEFAULT_SEARCH_QUERY) {
    raw.push({ query: DEFAULT_SEARCH_QUERY, color: undefined });
  }

  const seen = new Set();
  return raw.filter((a) => {
    const key = `${a.query}|${a.color ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
