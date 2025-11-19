import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestService } from '../../services/requestService';
import { listingService } from '../../services/listingService';
import { messageService } from '../../services/messageService';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [myRequests, setMyRequests] = useState([]);
  const [myListingsRequests, setMyListingsRequests] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications'); // notifications, my-requests, my-listings
  const [processing, setProcessing] = useState({});
  
  // Edit/Delete state
  const [editingListing, setEditingListing] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    age: '',
    gender: '',
    status: ''
  });
  const [deletingListing, setDeletingListing] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Profile fetchData başlatılıyor, user:', user);
      console.log('User userId:', user?.userId);
      console.log('isAuthenticated:', isAuthenticated);
      
      const [requestsData, listingsRequestsData] = await Promise.all([
        requestService.getMyRequests(),
        requestService.getMyListingsRequests(),
      ]);
      
      console.log('Gönderdiğim talepler:', requestsData);
      console.log('Gönderdiğim talepler sayısı:', requestsData?.length || 0);
      console.log('İlanlarıma gelen talepler:', listingsRequestsData);
      console.log('İlanlarıma gelen talepler sayısı:', listingsRequestsData?.length || 0);
      
      setMyRequests(requestsData || []);
      setMyListingsRequests(listingsRequestsData || []);
      
      // Kullanıcının ilanlarını çek - backend'de my-listings endpoint'i kullan
      console.log('getMyListings çağrılıyor...');
      const listingsData = await listingService.getMyListings({ page: 0, size: 100 });
      console.log('Kullanıcının ilanları (tam yanıt):', listingsData);
      console.log('Kullanıcının ilanları (content):', listingsData?.content);
      console.log('Kullanıcının ilanları sayısı:', listingsData?.content?.length || 0);
      setMyListings(listingsData?.content || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      console.error('Hata detayları:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessing({ ...processing, [requestId]: 'approving' });
      await requestService.approveRequest(requestId);
      
      // İlk mesajı gönder (hoş geldin mesajı)
      const request = myListingsRequests.find(r => r.requestId === requestId);
      if (request) {
        try {
          await messageService.sendMessage({
            listingId: request.listingId,
            receiverId: request.userId,
            content: 'Merhaba! Talebinizi onayladım. Detayları konuşmak için mesajlaşabiliriz.'
          });
        } catch (msgError) {
          console.error('Hoş geldin mesajı gönderilemedi:', msgError);
          // Mesaj gönderilemese bile devam et
        }
      }
      
      await fetchData(); // Verileri yenile
      
      // Mesajlaşma sayfasına yönlendir
      if (request) {
        navigate(`/messages?conversation=${request.listingId}`);
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert(error.response?.data?.message || 'Talep onaylanırken bir hata oluştu');
    } finally {
      setProcessing({ ...processing, [requestId]: false });
    }
  };

  const handleStartConversation = async (listingId, receiverId) => {
    navigate(`/messages?conversation=${listingId}&receiverId=${receiverId}`);
  };

  const handleEditListing = (listing) => {
    setEditingListing(listing.listingId);
    setEditData({
      title: listing.title || '',
      description: listing.description || '',
      age: listing.age || '',
      gender: listing.gender || '',
      status: listing.status || 'Mevcut'
    });
  };

  const handleSaveEdit = async (listingId) => {
    try {
      setProcessing({ ...processing, [`edit-${listingId}`]: true });
      const updateData = {
        title: editData.title.trim(),
        description: editData.description.trim(),
        age: parseInt(editData.age),
        gender: editData.gender,
        status: editData.status
      };

      await listingService.updateListing(listingId, updateData);
      setEditingListing(null);
      await fetchData(); // Verileri yenile
    } catch (error) {
      console.error('İlan güncellenirken hata:', error);
      alert(error.response?.data?.message || 'İlan güncellenirken bir hata oluştu');
    } finally {
      setProcessing({ ...processing, [`edit-${listingId}`]: false });
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      setProcessing({ ...processing, [`delete-${listingId}`]: true });
      await listingService.deleteListing(listingId);
      await fetchData(); // Verileri yenile
    } catch (error) {
      console.error('İlan silinirken hata:', error);
      alert(error.response?.data?.message || 'İlan silinirken bir hata oluştu');
    } finally {
      setProcessing({ ...processing, [`delete-${listingId}`]: false });
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Bu talebi reddetmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setProcessing({ ...processing, [requestId]: 'rejecting' });
      await requestService.rejectRequest(requestId);
      await fetchData(); // Verileri yenile
    } catch (error) {
      console.error('Reddetme hatası:', error);
      alert(error.response?.data?.message || 'Talep reddedilirken bir hata oluştu');
    } finally {
      setProcessing({ ...processing, [requestId]: false });
    }
  };

  const getPendingCount = () => {
    return myListingsRequests.filter(req => req.status === 'Beklemede').length;
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

  const pendingCount = getPendingCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Profilim
              </h1>
              <p className="text-gray-600">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 border border-gray-100">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors duration-300 relative ${
                activeTab === 'notifications'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Bildirimler
              {pendingCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors duration-300 ${
                activeTab === 'my-requests'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Gönderdiğim Talepler
            </button>
            <button
              onClick={() => setActiveTab('my-listings')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors duration-300 ${
                activeTab === 'my-listings'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              İlanlarım
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  İlanlarıma Gelen Talepler
                </h2>
                {myListingsRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-gray-500 text-lg">Henüz ilanlarınıza gelen talep yok.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myListingsRequests.map((request) => (
                      <div
                        key={request.requestId}
                        className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                          request.status === 'Beklemede'
                            ? 'border-yellow-300 bg-yellow-50 shadow-lg'
                            : request.status === 'Onaylandı'
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                request.status === 'Beklemede'
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : request.status === 'Onaylandı'
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-gray-200 text-gray-800'
                              }`}>
                                {request.status}
                              </span>
                              {request.status === 'Beklemede' && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                                  YENİ
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2 font-medium">
                              {request.requestMessage}
                            </p>
                            <p className="text-sm text-gray-500">
                              Talep Tarihi: {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <Link
                              to={`/listings/${request.listingId}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                            >
                              İlanı Görüntüle →
                            </Link>
                          </div>
                          {request.status === 'Beklemede' && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleApprove(request.requestId)}
                                disabled={processing[request.requestId]}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {processing[request.requestId] === 'approving' ? 'Onaylanıyor...' : 'Onayla'}
                              </button>
                              <button
                                onClick={() => handleReject(request.requestId)}
                                disabled={processing[request.requestId]}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {processing[request.requestId] === 'rejecting' ? 'Reddediliyor...' : 'Reddet'}
                              </button>
                            </div>
                          )}
                          {request.status === 'Onaylandı' && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleStartConversation(request.listingId, request.userId)}
                                className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                Mesajlaş
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Requests Tab */}
            {activeTab === 'my-requests' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gönderdiğim Talepler
                </h2>
                {myRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">Henüz hiç talep göndermediniz.</p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      İlanları Görüntüle
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div
                        key={request.requestId}
                        className={`border-2 rounded-xl p-6 ${
                          request.status === 'Onaylandı'
                            ? 'border-green-300 bg-green-50'
                            : request.status === 'Reddedildi'
                            ? 'border-red-300 bg-red-50'
                            : 'border-yellow-300 bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            request.status === 'Onaylandı'
                              ? 'bg-green-200 text-green-800'
                              : request.status === 'Reddedildi'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{request.requestMessage}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          Talep Tarihi: {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                        <Link
                          to={`/listings/${request.listingId}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          İlanı Görüntüle →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Listings Tab */}
            {activeTab === 'my-listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">İlanlarım</h2>
                  <Link
                    to="/create-listing"
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    + Yeni İlan
                  </Link>
                </div>
                {myListings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">Henüz hiç ilan oluşturmadınız.</p>
                    <Link
                      to="/create-listing"
                      className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      İlk İlanınızı Oluşturun
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((listing) => (
                      <div
                        key={listing.listingId}
                        className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-xl transition-all duration-300"
                      >
                        <Link to={`/listings/${listing.listingId}`}>
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <img
                              src={listing.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80'}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              listing.status === 'Mevcut'
                                ? 'bg-green-100 text-green-700'
                                : listing.status === 'Sahiplendirildi'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                        </Link>
                        
                        {/* Edit/Delete Buttons */}
                        {editingListing === listing.listingId ? (
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Başlık</label>
                                <input
                                  type="text"
                                  value={editData.title}
                                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Durum</label>
                                <select
                                  value={editData.status}
                                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                >
                                  <option value="Mevcut">Mevcut</option>
                                  <option value="Sahiplendirildi">Sahiplendirildi</option>
                                  <option value="Askıda">Askıda</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(listing.listingId)}
                                  disabled={processing[`edit-${listing.listingId}`]}
                                  className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                >
                                  {processing[`edit-${listing.listingId}`] ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                                <button
                                  onClick={() => setEditingListing(null)}
                                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 border-t border-gray-200 flex gap-2">
                            <button
                              onClick={() => handleEditListing(listing)}
                              className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteListing(listing.listingId)}
                              disabled={processing[`delete-${listing.listingId}`]}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {processing[`delete-${listing.listingId}`] ? 'Siliniyor...' : 'Sil'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

