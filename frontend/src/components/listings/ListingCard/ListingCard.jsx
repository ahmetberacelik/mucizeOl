import { Link } from 'react-router-dom';
import { useState } from 'react';

const ListingCard = ({ listing }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/listings/${listing.listingId}`}
      className="group relative block bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={listing.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80'}
          alt={listing.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Badge - Top Right */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-semibold rounded-full shadow-lg">
            {listing.animalTypeName || 'Hayvan'}
          </span>
        </div>

        {/* Hover Overlay Content */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-500 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{listing.cityName || 'Şehir'}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 bg-white">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
          {listing.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
            {listing.age && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{listing.age} yaş</span>
              </div>
            )}
          </div>
          
          {/* Arrow Icon - Appears on Hover */}
          <div className={`transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
          }`}>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 ${
        isHovered ? 'translate-x-full' : '-translate-x-full'
      }`} />
    </Link>
  );
};

export default ListingCard;

