import { useMemo } from "react";

/** Simple star bar (0–5) */
function StarBar({ rating = 0, size = 16 }) {
  const pct = Math.max(0, Math.min(5, Number(rating) || 0)) / 5 * 100;
  return (
    <div className="stars" aria-label={`Rating ${Number(rating).toFixed(1)} out of 5`} style={{ fontSize: size }}>
      <div className="stars-empty">★★★★★</div>
      <div className="stars-filled" style={{ width: `${pct}%` }}>★★★★★</div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString();
}

/** Choose the dominant sentiment label from a {Positive,Negative,Neutral} object of strings/numbers */
function dominantSentiment(sent = {}) {
  const toNum = (v) => (v == null ? 0 : Number(v));
  const P = toNum(sent.Positive), N = toNum(sent.Negative), Z = toNum(sent.Neutral);
  const max = Math.max(P, N, Z);
  if (max === 0) return null;
  if (max === P) return "Positive";
  if (max === N) return "Negative";
  return "Neutral";
}

/** Small inline sentiment chip */
function SentimentChip({ sentiment }) {
  if (!sentiment) return null;
  const map = { Positive: "🙂", Neutral: "😐", Negative: "🙁" };
  return <span className={`sentiment sentiment-${sentiment.toLowerCase()}`}>{map[sentiment]} {sentiment}</span>;
}

function Reviews({ reviews }) {
  const list = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);
  const top = useMemo(() => list.slice(0, 3), [list]);
  if (top.length === 0) return null;

  return (
    <details className="reviews" open>
      <summary>Reviews ({list.length})</summary>

      <ul className="review-list">
        {top.map((r, idx) => {
          const key = r.name ?? `${idx}`;
          const author = r.authorAttribution?.displayName ?? "Anonymous";
          const when = r.relativePublishTimeDescription || formatDate(r.publishTime);
          const avatar = r.authorAttribution?.photoUri;
          const text = r.text?.text || r.originalText?.text || "";
          const stars = Number(r.rating ?? 0);
          const senti = dominantSentiment(r.text?.sentiment);

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

              {text && (
                <p className="review-text">
                  {text} {senti && <span className="review-sentiment"><SentimentChip sentiment={senti} /></span>}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {list.length > 3 && (
        <div className="more-hint">Showing 3 of {list.length}. Open to view.</div>
      )}
    </details>
  );
}



/** Normalize one Google Places-style object to the UI's expected shape */
function normalizePlace(raw) {
  if (!raw || typeof raw !== "object") return null;

  const name =
    raw.displayName?.text ??
    raw.name ??
    raw.id ??
    "Untitled";

  const address =
    raw.formattedAddress ??
    raw.address ??
    "";

  const tags = Array.isArray(raw.types) ? raw.types : Array.isArray(raw.tags) ? raw.tags : [];

  const lat = raw.location?.latitude ?? raw.lat ?? null;
  const lng = raw.location?.longitude ?? raw.lng ?? null;

  // Reviews can be at raw.reviews (array) OR raw.reviews.reviews (array)
  const reviewList = Array.isArray(raw.reviews)
    ? raw.reviews
    : Array.isArray(raw.reviews?.reviews)
      ? raw.reviews.reviews
      : [];

  // Compute average rating if not provided
  const providedRating = raw.rating ?? raw.userRating ?? null;
  const avgFromReviews = reviewList.length
    ? (reviewList.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviewList.length)
    : null;
  const rating = Number(providedRating ?? avgFromReviews ?? 0);

  // Average sentiment (optional)
  const avgSent = raw.averagesentiment || raw.averageSentiment || null;

  return {
    id: raw.id,
    name,
    rating,
    address,
    description: raw.description ?? raw.greasereviews ?? "",
    tags,
    lat: lat == null ? null : Number(lat),
    lng: lng == null ? null : Number(lng),
    reviews: reviewList,
    avgSent
  };
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

      {/* Optional average sentiment badge if present */}
      {loc.avgSent && (
        <p className="avg-sentiment">
          <SentimentChip sentiment={dominantSentiment(loc.avgSent)} />
          <span className="sent-values">
            {" "}P:{Number(loc.avgSent.Positive ?? 0).toFixed(2)} ·
            N:{Number(loc.avgSent.Negative ?? 0).toFixed(2)} ·
            Z:{Number(loc.avgSent.Neutral ?? 0).toFixed(2)}
          </span>
        </p>
      )}

      <Reviews reviews={loc.reviews} />
    </article>
  );
}

export default function GreasyWindow({ locations }) {
  // Accept either a single object or an array of objects
  const normalized = useMemo(() => {
    const arr = Array.isArray(locations) ? locations : (locations ? [locations] : []);
    return arr.map(normalizePlace).filter(Boolean);
  }, [locations]);

  if (!normalized.length) {
    return <p className="empty">No locations match your filters.</p>;
  }

  return (
    <section>
      <div className="summary">
        Showing <strong>{normalized.length}</strong> location{normalized.length === 1 ? "" : "s"}
      </div>
      <div className="grid">
        {normalized.map((loc, i) => (
          <LocationCard key={loc.id ?? `${loc.name}-${i}`} loc={loc} />
        ))}
      </div>
    </section>
  );
}
