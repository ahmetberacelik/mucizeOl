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
      [field]: value || undefined,
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
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Şehir Filtresi */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="cityFilter" className="form-label mb-2">
            Şehir
          </label>
          <select
            id="cityFilter"
            className="form-select"
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
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="typeFilter" className="form-label mb-2">
            Hayvan Türü
          </label>
          <select
            id="typeFilter"
            className="form-select"
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
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="breedFilter" className="form-label mb-2">
            Hayvan Cinsi
          </label>
          <select
            id="breedFilter"
            className="form-select"
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
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearFilters}
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;

