// geocodingFunctions.js

// Function 1: Fetch geocoding data from Geoapify
async function fetchGeocodingData(query, apiKey) {
  const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}`;

  const fetch = await import("node-fetch");
  const response = await fetch.default(apiUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

// Function 2: Fetch place details from Geoapify using place_id
async function fetchPlaceDetails(place_id, apiKey) {
  const apiUrl_PlaceDetails = `https://api.geoapify.com/v2/place-details?id=${place_id}&fields=details.website,details.description,details.opening_hours,contact.phone,contact.email,details.dogs,restrictions.min_age,restrictions.max_age&apiKey=${apiKey}&features=walk_15.tourism`;
  console.log(apiUrl_PlaceDetails);
  const fetch = await import("node-fetch");
  const response = await fetch.default(apiUrl_PlaceDetails);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

async function encapsulateJsonInLocalData(jsonArr) {
  if (!Array.isArray(jsonArr)) {
    throw new Error("Input is not an array");
  }
  
  return jsonArr.map(jsonObj => {
    return {
      localdata: jsonObj
    };
  });
}


module.exports = {
  fetchGeocodingData,
  fetchPlaceDetails,
  encapsulateJsonInLocalData
};
