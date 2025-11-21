import { useState, useEffect } from 'react';
import { listingService } from '../../../services/listingService';

const ListingFilters = ({ onFilterChange, filters }) => {
  const [cities, setCities] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [citiesData, typesData] = await Promise.all([
          listingService.getCities(),
          listingService.getAnimalTypes(),
        ]);
        setCities(citiesData);
        setAnimalTypes(typesData);
      } catch (error) {
        console.error('Meta veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetaData();
  }, []);

  useEffect(() => {
    // Hayvan türü değiştiğinde cinsleri yükle
    const fetchBreeds = async () => {
      if (filters.animalTypeId) {
        try {
          const breedsData = await listingService.getAnimalBreeds(filters.animalTypeId);
          setBreeds(breedsData);
        } catch (error) {
          console.error('Cinsler yüklenirken hata:', error);
        }
      } else {
        setBreeds([]);
      }
    };

    fetchBreeds();
  }, [filters.animalTypeId]);

  const handleChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value && value !== '' ? value : undefined,
    };

    // Tür değiştiğinde cins filtresini sıfırla
    if (field === 'animalTypeId') {
      newFilters.animalBreedId = undefined;
    }

    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      cityId: undefined,
      animalTypeId: undefined,
      animalBreedId: undefined,
    };
    onFilterChange(clearedFilters);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
          <span className="text-sm sm:text-base text-gray-600 font-medium">Filtreler yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
        {/* Şehir Filtresi */}
        <div className="flex-1 w-full sm:min-w-[200px]">
          <label htmlFor="cityFilter" className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Şehir
            </div>
          </label>
          <select
            id="cityFilter"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white text-gray-700 font-medium hover:border-primary-300 cursor-pointer text-sm sm:text-base"
            value={filters.cityId || ''}
            onChange={(e) => handleChange('cityId', e.target.value)}
          >
            <option value="">Tüm Şehirler</option>
            {cities.map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Hayvan Türü Filtresi */}
        <div className="flex-1 w-full sm:min-w-[200px]">
          <label htmlFor="typeFilter" className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Hayvan Türü
            </div>
          </label>
          <select
            id="typeFilter"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white text-gray-700 font-medium hover:border-primary-300 cursor-pointer text-sm sm:text-base"
            value={filters.animalTypeId || ''}
            onChange={(e) => handleChange('animalTypeId', e.target.value)}
          >
            <option value="">Tüm Türler</option>
            {animalTypes.map((type) => (
              <option key={type.typeId} value={type.typeId}>
                {type.typeName}
              </option>
            ))}
          </select>
        </div>

        {/* Hayvan Cinsi Filtresi */}
        <div className="flex-1 w-full sm:min-w-[200px]">
          <label htmlFor="breedFilter" className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Hayvan Cinsi
            </div>
          </label>
          <select
            id="breedFilter"
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white text-gray-700 font-medium cursor-pointer text-sm sm:text-base ${
              !filters.animalTypeId 
                ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                : 'border-gray-200 hover:border-primary-300'
            }`}
            value={filters.animalBreedId || ''}
            onChange={(e) => handleChange('animalBreedId', e.target.value)}
            disabled={!filters.animalTypeId}
          >
            <option value="">Tüm Cinsler</option>
            {breeds.map((breed) => (
              <option key={breed.breedId} value={breed.breedId}>
                {breed.breedName}
              </option>
            ))}
          </select>
        </div>

        {/* Filtreleri Temizle Butonu */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={clearFilters}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;

