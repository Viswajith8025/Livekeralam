import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const HeartButton = ({ item, type, className = "" }) => {
  const { toggleEvent, togglePlace, isInWishlist } = useWishlist();
  const active = isInWishlist(item._id, type);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'event') toggleEvent(item);
    else togglePlace(item);
  };

  return (
    <button 
      onClick={handleClick}
      className={`p-3 rounded-2xl backdrop-blur-md transition-all duration-300 border ${
        active 
          ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30' 
          : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
      } ${className}`}
    >
      <Heart className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
    </button>
  );
};

export default HeartButton;
