/**
 * Unsplash API utility for fetching photos.
 * Uses the Search Photos endpoint with optional color filtering.
 * API key is read from Vite's import.meta.env (see .env file).
 */

const BASE_URL = 'https://api.unsplash.com';
const PER_PAGE = 20;

/**
 * Fetches photos from Unsplash Search API.
 * @param {Object} params
 * @param {string} params.query - Search query
 * @param {string|undefined} params.color - Unsplash API color param (e.g. "red", "magenta")
 * @param {number} params.page - Page number for pagination
 * @returns {Promise<{results: Array, total: number}>}
 */
export async function searchPhotos({ query, color, page = 1 }) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      'Missing Unsplash API key. Add VITE_UNSPLASH_ACCESS_KEY to your .env file. See README for setup.'
    );
  }

  const url = new URL(`${BASE_URL}/search/photos`);
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(PER_PAGE));
  url.searchParams.set('client_id', accessKey);

  if (color) {
    url.searchParams.set('color', color);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.errors?.[0] || `API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const total = parseInt(response.headers.get('X-Total') || '0', 10);

  return {
    results: data.results || [],
    total,
  };
}
