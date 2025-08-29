import { useMemo } from "react";

function StarBar({ rating = 0, size = 16 }) {
  const percentage = Math.max(0, Math.min(5, rating)) / 5 * 100;
  return (
    <div className="stars" aria-label={`Rating ${rating} out of 5`} style={{ fontSize: size }}>
      <div className="stars-empty">★★★★★</div>
      <div className="stars-filled" style={{ width: `${percentage}%` }}>★★★★★</div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString();
}

function Reviews({ reviews }) {
const top = useMemo(
    () => (Array.isArray(reviews) ? reviews.slice(0, 3) : []),
    [reviews]
  );
  
  if (top.length === 0) return null;

  return (
    <details className="reviews">
      <summary>
        Reviews ({reviews.length})
      </summary>

      <ul className="review-list">
        {top.map((r, idx) => {
          const key = r.name ?? `${idx}`;
          const author = r.authorAttribution?.displayName ?? "Anonymous";
          const when = r.relativePublishTimeDescription || formatDate(r.publishTime);
          const avatar = r.authorAttribution?.photoUri;
          const text = r.text?.text || r.originalText?.text || "";
          const stars = Number(r.rating ?? 0);

          return (
            <li key={key} className="review">
              <div className="review-header">
                {avatar ? <img className="avatar" src={avatar} alt="" /> : <div className="avatar avatar-fallback" aria-hidden="true">👤</div>}
                <div className="review-meta">
                  <div className="author">{author}</div>
                  <div className="time">{when}</div>
                </div>
                <StarBar rating={stars} size={14} />
              </div>
              {text && <p className="review-text">{text}</p>}
            </li>
          );
        })}
      </ul>

      {reviews.length > 3 && (
        <div className="more-hint">Showing 3 of {reviews.length}. Open to view.</div>
      )}
    </details>
  );
}

function LocationCard({ loc }) {
  return (
    <article className="card">
      <header className="card-header">
        <h2 className="card-title">{loc.name ?? "Untitled"}</h2>
        <StarBar rating={Number(loc.rating ?? 0)} />
      </header>

      {loc.address && <p className="muted">{loc.address}</p>}
      {loc.description && <p className="desc">{loc.description}</p>}

      {Array.isArray(loc.tags) && loc.tags.length > 0 && (
        <ul className="tags" aria-label="Tags">
          {loc.tags.map((t, i) => <li key={i} className="tag">#{t}</li>)}
        </ul>
      )}

      {(loc.lat != null && loc.lng != null) && (
        <p className="coords">
          <span>Lat: {Number(loc.lat).toFixed(4)}</span> ·{" "}
          <span>Lng: {Number(loc.lng).toFixed(4)}</span>
        </p>
      )}

      {/* NEW: reviews */}
      <Reviews reviews={loc.reviews} />
    </article>
  );
}

export default function GreasyWindow({ locations }) {
  if (!locations.length) {
    return <p className="empty">No locations match your filters.</p>;
  }

  return (
    <section>
      <div className="summary">
        Showing <strong>{locations.length}</strong> location{locations.length === 1 ? "" : "s"}
      </div>
      <div className="grid">
        {locations.map((loc) => (
          <LocationCard key={loc.id ?? `${loc.name}-${Math.random()}`} loc={loc} />
        ))}
      </div>
    </section>
  );
}
