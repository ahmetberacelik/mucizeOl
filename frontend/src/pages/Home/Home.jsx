import { useState, useEffect } from 'react';
import { listingService } from '../../services/listingService';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import ListingFilters from '../../components/listings/ListingFilters/ListingFilters';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    cityId: undefined,
    animalTypeId: undefined,
    animalBreedId: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchListings = async (currentFilters = filters, currentPage = 0) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        size: pagination.size,
        sort: 'createdAt,desc',
      };

      // Filtreleri ekle - sadece değer varsa ekle
      if (currentFilters.cityId) {
        params.cityId = currentFilters.cityId;
      }
      if (currentFilters.animalTypeId) {
        params.animalTypeId = currentFilters.animalTypeId;
      }
      if (currentFilters.animalBreedId) {
        params.animalBreedId = currentFilters.animalBreedId;
      }

      console.log('API çağrısı yapılıyor:', params);
      const data = await listingService.getListings(params);
      console.log('API yanıtı:', data);
      console.log('İlan sayısı:', data.content?.length || 0);
      
      setListings(data.content || []);
      setPagination({
        page: data.number || 0,
        size: data.size || 12,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      });
    } catch (err) {
      console.error('İlanlar yüklenirken hata:', err);
      console.error('Hata detayları:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError(`İlanlar yüklenirken bir hata oluştu: ${err.response?.data?.message || err.message || 'Bilinmeyen hata'}. Backend servisi çalışıyor mu kontrol edin.`);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchListings(newFilters, 0);
  };

  const handlePageChange = (newPage) => {
    fetchListings(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 py-6 sm:py-10 md:py-16 lg:py-20 mb-6 sm:mb-8 md:mb-12">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Decorative Images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-yellow-300/20 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Text Content */}
            <div className="text-center md:text-left">
              {/* MucizeOl Logo/Brand */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-2 sm:mb-3 md:mb-4 leading-tight drop-shadow-2xl">
                  <span className="block text-blue-900">
                    Mucize
                  </span>
                  <span className="block text-white">
                    <span className="text-green-400">O</span>
                    <span className="text-green-400">l</span>
                  </span>
                </h1>
              </div>
              
              {/* Slogan */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1 sm:mb-2 md:mb-4 leading-tight sm:leading-relaxed drop-shadow-lg">
                  Bir hayvana mucize olmak,
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 leading-tight sm:leading-relaxed drop-shadow-lg">
                  bir hayvanın da bize mucize olabileceği
                </p>
              </div>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-4 sm:mb-6 md:mb-8 leading-relaxed px-1 sm:px-2 md:px-0">
                Sevimli dostlarımız için yeni bir yuva bulalım. Her hayvan bir aileyi bekliyor.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 md:gap-4 text-white/80 mb-2 sm:mb-4 md:mb-8">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Güvenli</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">Kolay</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Sevgi Dolu</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80"
                    alt="Golden Retriever"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80"
                    alt="Cat"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80"
                    alt="Puppy"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80"
                    alt="Cat"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-12">
        {/* Filtreleme Bileşeni */}
        <div className="mb-4 sm:mb-6 md:mb-10">
          <ListingFilters onFilterChange={handleFilterChange} filters={filters} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 mb-8 shadow-lg" role="alert">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 mb-2">Bir Hata Oluştu</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => fetchListings()}
                  className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        )}

        {/* İlan Listesi */}
        {!loading && !error && (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-2xl font-semibold text-gray-700 mb-2">
                    İlan Bulunamadı
                  </p>
                  <p className="text-gray-500 text-lg">
                    Aradığınız kriterlere uygun ilan bulunamadı. Filtreleri değiştirmeyi deneyin.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 sm:mb-6 flex items-center justify-between">
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    <span className="text-primary-600 font-bold">{pagination.totalElements}</span> ilan bulundu
                  </p>
                </div>

                {/* Grid Layout - Modern Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                  {listings.map((listing) => (
                    <ListingCard key={listing.listingId} listing={listing} />
                  ))}
                </div>

                {/* Pagination - Modern Design */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 0}
                      className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 hover:shadow-md disabled:hover:border-gray-200 disabled:hover:text-gray-700 text-sm sm:text-base"
                    >
                      Önceki
                    </button>
                    
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        // Mobilde sadece ilk, son ve mevcut sayfa civarındaki sayfaları göster
                        const showPage = pagination.totalPages <= 7 || 
                                        index === 0 || 
                                        index === pagination.totalPages - 1 || 
                                        (index >= pagination.page - 1 && index <= pagination.page + 1);
                        
                        if (!showPage && pagination.totalPages > 7) {
                          // Elipsis göster
                          if (index === pagination.page - 2 || index === pagination.page + 2) {
                            return (
                              <span key={index} className="px-2 text-gray-500">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handlePageChange(index)}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                              pagination.page === index
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-110'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 hover:shadow-md'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages - 1}
                      className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 hover:shadow-md disabled:hover:border-gray-200 disabled:hover:text-gray-700 text-sm sm:text-base"
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

