import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  return (
    <Link
      to={`/listings/${listing.listingId}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={listing.imageUrl || '/placeholder-image.jpg'}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {listing.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{listing.cityName || 'Şehir'}</span>
          <span>•</span>
          <span>{listing.animalTypeName || 'Tür'}</span>
        </div>
        {listing.age && (
          <p className="text-sm text-gray-500 mt-2">Yaş: {listing.age}</p>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;

