/**
 * Sharable Journey Encoder/Decoder
 * Encodes wishlist IDs into a URL-friendly string.
 */

export const encodeJourney = (wishlist) => {
  const data = {
    e: wishlist.events.map(ev => ev._id),
    p: wishlist.places.map(pl => pl._id)
  };
  return btoa(JSON.stringify(data));
};

export const decodeJourney = (encoded) => {
  try {
    const data = JSON.parse(atob(encoded));
    return {
      eventIds: data.e || [],
      placeIds: data.p || []
    };
  } catch (error) {
    console.error("Failed to decode journey", error);
    return { eventIds: [], placeIds: [] };
  }
};
