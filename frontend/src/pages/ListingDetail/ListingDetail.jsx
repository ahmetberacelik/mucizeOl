import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingService } from '../../services/listingService';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [city, setCity] = useState(null);
  const [animalType, setAnimalType] = useState(null);
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  // Edit state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    age: '',
    gender: '',
    status: ''
  });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const listingData = await listingService.getListingById(id);
        setListing(listingData);
        
        // Edit form için başlangıç değerlerini ayarla
        setEditData({
          title: listingData.title || '',
          description: listingData.description || '',
          age: listingData.age || '',
          gender: listingData.gender || '',
          status: listingData.status || 'Mevcut'
        });
        
        // Meta bilgilerini çek
        const [cities, types] = await Promise.all([
          listingService.getCities(),
          listingService.getAnimalTypes(),
        ]);
        
        const cityData = cities.find(c => c.cityId === listingData.cityId);
        const typeData = types.find(t => t.typeId === listingData.animalTypeId);
        
        setCity(cityData);
        setAnimalType(typeData);
        
        if (typeData) {
          const breeds = await listingService.getAnimalBreeds(typeData.typeId);
          const breedData = breeds.find(b => b.breedId === listingData.animalBreedId);
          setBreed(breedData);
        }
      } catch (err) {
        console.error('İlan yüklenirken hata:', err);
        setError('İlan yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditing(true);

    try {
      const updateData = {
        title: editData.title.trim(),
        description: editData.description.trim(),
        age: parseInt(editData.age),
        gender: editData.gender,
        status: editData.status
      };

      const updatedListing = await listingService.updateListing(id, updateData);
      setListing(updatedListing);
      setShowEditForm(false);
      setEditSuccess(true);
      
      setTimeout(() => {
        setEditSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('İlan güncellenirken hata:', err);
      setEditError(err.response?.data?.message || 'İlan güncellenirken bir hata oluştu');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError('');
    setDeleting(true);

    try {
      await listingService.deleteListing(id);
      navigate('/profile?tab=my-listings');
    } catch (err) {
      console.error('İlan silinirken hata:', err);
      setDeleteError(err.response?.data?.message || 'İlan silinirken bir hata oluştu');
      setDeleting(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestError('');
    setSubmitting(true);

    try {
      console.log('Talep gönderiliyor:', {
        listingId: parseInt(id),
        requestMessage: requestMessage.trim()
      });
      
      const response = await requestService.createRequest({
        listingId: parseInt(id),
        requestMessage: requestMessage.trim(),
      });
      
      console.log('Talep başarıyla oluşturuldu:', response);
      
      setRequestSuccess(true);
      setShowRequestForm(false);
      setRequestMessage('');
      
      setTimeout(() => {
        setRequestSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Talep oluşturulurken hata:', err);
      console.error('Hata detayları:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url,
        baseURL: err.config?.baseURL,
        fullURL: err.config ? `${err.config.baseURL}${err.config.url}` : 'N/A'
      });
      
      // Daha detaylı hata mesajı
      let errorMessage = 'Talep oluşturulurken bir hata oluştu';
      let errorDetails = '';
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
        
        // Validation hatalarını göster
        if (err.response.data.errors) {
          const validationErrors = Object.values(err.response.data.errors).flat();
          errorDetails = validationErrors.join(', ');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Özel hata mesajları
      if (err.response?.status === 401) {
        errorMessage = 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok.';
      } else if (err.response?.status === 404) {
        errorMessage = 'İlan bulunamadı.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Bu ilana daha önce talep gönderdiniz.';
      } else if (err.response?.status === 400) {
        errorMessage = errorMessage || 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.';
        if (errorDetails) {
          errorMessage += ` (${errorDetails})`;
        }
      } else if (!err.response) {
        errorMessage = `Sunucuya bağlanılamıyor. ${err.message || 'Backend servisi çalışıyor mu kontrol edin.'}`;
        if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Ağ hatası. Backend servisi çalışıyor mu ve API URL doğru mu kontrol edin.';
        }
      }
      
      setRequestError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız ilan bulunamadı'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.userId === listing.userId;
  const canRequest = isAuthenticated && !isOwner && listing.status === 'Mevcut';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {requestSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Talep Başarıyla Gönderildi!</h3>
                <p className="text-green-700">İlan sahibi talebinizi inceleyecek ve size dönüş yapacaktır.</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Geri Dön</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={listing.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80'}
                alt={listing.title}
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80';
                }}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                  {animalType?.typeName || 'Hayvan'}
                </span>
                {listing.status && (
                  <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                    listing.status === 'Mevcut' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {listing.status}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {listing.title}
              </h1>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Şehir</p>
                    <p className="text-lg font-bold text-gray-900">{city?.cityName || 'Bilinmiyor'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Yaş</p>
                    <p className="text-lg font-bold text-gray-900">{listing.age || 'Bilinmiyor'} yaş</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Cins</p>
                    <p className="text-lg font-bold text-gray-900">{breed?.breedName || 'Bilinmiyor'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Cinsiyet</p>
                    <p className="text-lg font-bold text-gray-900">{listing.gender || 'Bilinmiyor'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {canRequest && (
                <>
                  {!showRequestForm ? (
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Sahiplenme Talebi Gönder
                      </div>
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Sahiplenme Talebi</h3>
                      
                      {requestError && (
                        <div className="mb-4 bg-red-50 border-2 border-red-400 rounded-xl p-4 shadow-lg animate-pulse">
                          <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <h4 className="font-bold text-red-900 mb-2 text-lg">Hata Oluştu</h4>
                              <p className="text-red-800 font-medium">{requestError}</p>
                              <p className="text-red-600 text-sm mt-2">
                                Lütfen tarayıcı konsolunu (F12) açarak daha detaylı hata bilgilerini kontrol edin.
                              </p>
                            </div>
                            <button
                              onClick={() => setRequestError('')}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              aria-label="Hata mesajını kapat"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmitRequest} className="space-y-4">
                        <div>
                          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                            Mesajınız *
                          </label>
                          <textarea
                            id="message"
                            rows={5}
                            required
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"
                            placeholder="İlan sahibine iletmek istediğiniz mesajı yazın..."
                          />
                        </div>
                        
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowRequestForm(false);
                              setRequestMessage('');
                              setRequestError('');
                            }}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                          >
                            İptal
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? 'Gönderiliyor...' : 'Gönder'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
              
              {!isAuthenticated && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <p className="text-yellow-800 mb-4">
                    Sahiplenme talebi göndermek için giriş yapmanız gerekiyor.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}
              
              {isOwner && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <p className="text-blue-800 font-medium mb-4">
                      Bu ilan size ait. Sahiplenme taleplerini profil sayfanızdan görüntüleyebilirsiniz.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEditForm(!showEditForm)}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        {showEditForm ? 'İptal' : 'Düzenle'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {showEditForm && (
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">İlanı Düzenle</h3>
                      
                      {editSuccess && (
                        <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                          <p className="text-green-800 font-medium">İlan başarıyla güncellendi!</p>
                        </div>
                      )}
                      
                      {editError && (
                        <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                          <p className="text-red-800 font-medium">{editError}</p>
                        </div>
                      )}
                      
                      <form onSubmit={handleEdit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Başlık *
                          </label>
                          <input
                            type="text"
                            required
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Açıklama *
                          </label>
                          <textarea
                            rows={5}
                            required
                            value={editData.description}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Yaş *
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={editData.age}
                              onChange={(e) => setEditData({...editData, age: e.target.value})}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Cinsiyet *
                            </label>
                            <select
                              required
                              value={editData.gender}
                              onChange={(e) => setEditData({...editData, gender: e.target.value})}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            >
                              <option value="">Seçiniz</option>
                              <option value="Dişi">Dişi</option>
                              <option value="Erkek">Erkek</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Durum *
                          </label>
                          <select
                            required
                            value={editData.status}
                            onChange={(e) => setEditData({...editData, status: e.target.value})}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          >
                            <option value="Mevcut">Mevcut</option>
                            <option value="Sahiplendirildi">Sahiplendirildi</option>
                            <option value="Askıda">Askıda</option>
                          </select>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={editing}
                          className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {editing ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">İlanı Sil</h3>
                        <p className="text-gray-700 mb-6">
                          Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        
                        {deleteError && (
                          <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <p className="text-red-800 font-medium">{deleteError}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteError('');
                            }}
                            disabled={deleting}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            İptal
                          </button>
                          <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {deleting ? 'Siliniyor...' : 'Sil'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {listing.status !== 'Mevcut' && !isOwner && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                  <p className="text-gray-700 font-medium">
                    Bu ilan artık sahiplendirme için uygun değil.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;

