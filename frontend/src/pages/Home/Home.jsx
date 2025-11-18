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
      const params = {
        page: currentPage,
        size: pagination.size,
        sort: 'createdAt,desc',
        ...currentFilters,
      };

      // Undefined değerleri temizle
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const data = await listingService.getListings(params);
      setListings(data.content || []);
      setPagination({
        page: data.number || 0,
        size: data.size || 12,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      });
    } catch (err) {
      setError('İlanlar yüklenirken bir hata oluştu');
      console.error(err);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hayvan Sahiplendirme Platformu
        </h1>
        <p className="text-gray-600 text-lg">
          Sevimli dostlarımız için yeni bir yuva bulalım
        </p>
      </div>

      {/* Filtreleme Bileşeni */}
      <ListingFilters onFilterChange={handleFilterChange} filters={filters} />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* İlan Listesi */}
      {!loading && !error && (
        <>
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aradığınız kriterlere uygun ilan bulunamadı.
              </p>
            </div>
          ) : (
            <>
              {/* Grid Layout - Tailwind CSS Grid kullanımı */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.listingId} listing={listing} />
                ))}
              </div>

              {/* Pagination - Bootstrap kullanımı */}
              {pagination.totalPages > 1 && (
                <nav aria-label="Sayfa navigasyonu">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${pagination.page === 0 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 0}
                      >
                        Önceki
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${pagination.page === index ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        pagination.page >= pagination.totalPages - 1 ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages - 1}
                      >
                        Sonraki
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

