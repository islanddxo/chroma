import './ImageCard.css';

const UTM_SOURCE = 'chroma_app';
const UTM_MEDIUM = 'referral';

/**
 * Single image card in the masonry grid.
 * Preserves natural aspect ratio and includes photographer attribution per Unsplash guidelines.
 */
export default function ImageCard({ image }) {
  const { urls, alt_description, user, links } = image;
  const thumbUrl = urls?.regular || urls?.small;
  const alt = alt_description || 'Unsplash photo';
  const photoUrl = links?.html ? `${links.html}?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}` : links?.html;
  const userUrl = user?.links?.html
    ? `${user.links.html}?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}`
    : user?.username
      ? `https://unsplash.com/@${user.username}?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}`
      : null;

  return (
    <article className="image-card">
      <a
        href={photoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="image-card__link"
      >
        <img
          src={thumbUrl}
          alt={alt}
          className="image-card__img"
          loading="lazy"
        />
        <div className="image-card__overlay">
          <span className="image-card__attribution">
            by{' '}
            {userUrl ? (
              <a
                href={userUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="image-card__attribution-link"
              >
                {user?.name}
              </a>
            ) : (
              user?.name
            )}{' '}
            on{' '}
            <a
              href={`https://unsplash.com/?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="image-card__attribution-link"
            >
              Unsplash
            </a>
          </span>
        </div>
      </a>
    </article>
  );
}
