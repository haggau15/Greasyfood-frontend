import React from "react";
import data from "./testdata.json"; // your JSON file

const PlacesList = () => {
  return (
    <div className="p-4 space-y-6">
      {data.places.map((place) => (
        <div
          key={place.id}
          className="p-4 border rounded-lg shadow-md bg-white"
        >
          {/* Place name */}
          <h2 className="text-xl font-semibold">
            {place.displayName?.text}
          </h2>

          {/* Address */}
          <p className="text-gray-600">{place.formattedAddress}</p>

          {/* Types */}
          <div className="flex flex-wrap gap-2 mt-2">
            {place.types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 text-sm bg-gray-100 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>

          {/* Reviews (if they exist) */}
          {place.reviews && (
            <div className="mt-4 space-y-3">
              <h3 className="font-medium">Reviews:</h3>
              {place.reviews.map((review) => (
                <div
                  key={review.name}
                  className="p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={review.authorAttribution.photoUri}
                      alt={review.authorAttribution.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <a
                      href={review.authorAttribution.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600"
                    >
                      {review.authorAttribution.displayName}
                    </a>
                  </div>
                  <p className="text-yellow-500">⭐ {review.rating}</p>
                  <p>{review.text.text}</p>
                  <span className="text-xs text-gray-400">
                    {review.relativePublishTimeDescription}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlacesList;