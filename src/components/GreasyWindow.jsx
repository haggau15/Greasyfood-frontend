function StarBar({ rating = 0 }) {
  // Draw 5 stars with a filled overlay based on rating (0..5)
  const percentage = Math.max(0, Math.min(5, rating)) / 5 * 100;
  return (
    <div className="stars" aria-label={`Rating ${rating} out of 5`}>
      <div className="stars-empty">★★★★★</div>
      <div className="stars-filled" style={{ width: `${percentage}%` }}>★★★★★</div>
    </div>
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
