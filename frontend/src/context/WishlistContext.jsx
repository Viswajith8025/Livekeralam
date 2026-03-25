import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('livekeralam_wishlist');
    return saved ? JSON.parse(saved) : { events: [], places: [] };
  });

  useEffect(() => {
    localStorage.setItem('livekeralam_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleEvent = (event) => {
    setWishlist(prev => {
      const isExist = prev.events.find(e => e._id === event._id);
      if (isExist) {
        return { ...prev, events: prev.events.filter(e => e._id !== event._id) };
      }
      return { ...prev, events: [...prev.events, event] };
    });
  };

  const togglePlace = (place) => {
    setWishlist(prev => {
      const isExist = prev.places.find(p => p._id === place._id);
      if (isExist) {
        return { ...prev, places: prev.places.filter(p => p._id !== place._id) };
      }
      return { ...prev, places: [...prev.places, place] };
    });
  };

  const isInWishlist = (id, type) => {
    if (type === 'event') return wishlist.events.some(e => e._id === id);
    if (type === 'place') return wishlist.places.some(p => p._id === id);
    return false;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleEvent, togglePlace, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
