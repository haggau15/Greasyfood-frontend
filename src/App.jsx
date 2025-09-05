import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from "./components/Sidebar.jsx";
import GreasyWindow from "./components/GreasyWindow.jsx";
import "./Styles.css";
import { fallBackData } from "./fallbackData.js";
//import { jsx } from 'react/jsx-runtime';

// Normalize Google Places-style objects into the internal shape used by LocationsWindow
function normalizePlacesPayload(payload) {
  const places = Array.isArray(payload) ? payload : (payload?.places ?? []);
  return places.map((p) => ({
    id: p.id ?? p.place_id ?? crypto.randomUUID(),
    name: p.displayName?.text ?? p.name ?? "Untitled",
    address: p.formattedAddress ?? p.formatted_address ?? "",
    rating: Number(p.rating ?? 0),
    tags: Array.isArray(p.types) ? p.types : [],
    description: undefined, // could derive from top review if desired
    lat: p.location?.latitude ?? p.geometry?.location?.lat ?? null,
    lng: p.location?.longitude ?? p.geometry?.location?.lng ?? null,
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
  }));
}

export default function App() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("name"); // "name" | "rating"
  //const [reviews,setReviews] = useState("");

  const variable = process.env.REACT_APP_API_KEY;
  console.log(variable);
  
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");
      setUsingFallback(false);
      console.log("URL: ",`${process.env.REACT_APP_CONSUMECDB_URI}`);

      const res = await fetch(`${process.env.REACT_APP_CONSUMECDB_URI}`, {
        headers: { Accept: "application/json" ,
          
        },
      });
      if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);
      const data = await res.json();

      // Accept either our internal array OR a Google Places-like shape
      if (Array.isArray(data)) {
        // If array items look like Google Places, normalize them
        if (
          data.length > 0 &&
          (data[0]?.displayName || data[0]?.formattedAddress || data[0]?.location)
        ) {
          setLocations(normalizePlacesPayload(data));
        } else {
          // assume it's already in internal shape
          setLocations(data);
        }
      } else if (data && (data.places || data.results)) {
        setLocations(normalizePlacesPayload(data.places ?? data.results));
      } else {
        // unexpected shape -> use fallback
        setLocations(normalizePlacesPayload(fallBackData));
        setUsingFallback(true);
        setError("Unexpected API response shape — using fallback data.");
      }
    } catch (e) {
      console.error(e);
      // On any failure, gracefully use fallback
      setLocations(normalizePlacesPayload(fallBackData));
      setUsingFallback(true);
      setError("Backend unavailable — showing fallback data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSorted = useMemo(() => {
    const filtered = locations.filter((l) => Number(l.rating ?? 0) >= minRating);
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return String(a.name ?? "").localeCompare(String(b.name ?? ""));
    });
    return sorted;
  }, [locations, minRating, sortBy]);

  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Filters and controls">
        <Sidebar
          minRating={minRating}
          onMinRatingChange={setMinRating}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={fetchLocations}
          loading={loading}
        />
      </aside>

      <main className="main" aria-live="polite">
        {usingFallback && !loading && (
          <div
            className="loading"
            style={{ marginBottom: 12, background: "#fffef5", borderColor: "#facc15" }}
          >
            <strong>Offline mode:</strong> using bundled fallback data.
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner" aria-hidden="true" />
            <p>Loading locations…</p>
          </div>
        )}

        {!loading && error && !usingFallback && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        {!loading && (
          <GreasyWindow locations={filteredSorted} />
        )}
      </main>
    </div>
  );
}
