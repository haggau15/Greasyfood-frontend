export default function Sidebar({
  minRating,
  onMinRatingChange,
  sortBy,
  onSortChange,
  onRefresh,
  loading
}) {
  return (
    <div className="sidebar-inner">
      <h1 className="app-title">Places</h1>

      <div className="control-group">
        <label className="label">Sort by</label>
        <div className="button-row" role="group" aria-label="Sort options">
          <button
            className={`btn ${sortBy === "name" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onSortChange("name")}
          >
            Name
          </button>
          <button
            className={`btn ${sortBy === "rating" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onSortChange("rating")}
          >
            Rating
          </button>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="ratingRange" className="label">
          Minimum rating: <strong>{minRating.toFixed(1)}</strong>
        </label>
        <input
          id="ratingRange"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={minRating}
          onChange={(e) => onMinRatingChange(Number(e.target.value))}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={minRating}
        />
        <div className="ticks" aria-hidden="true">
          <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        </div>
      </div>

      <div className="control-group">
        <button className="btn btn-outline full" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <p className="hint">
        Tip: Use the slider to filter by rating, then choose your sort.
      </p>
    </div>
  );
}
