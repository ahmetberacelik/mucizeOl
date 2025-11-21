import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { listingService } from '../../services/listingService';
import { authService } from '../../services/authService';

const Messages = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [listingInfo, setListingInfo] = useState(null);
  const [otherUserInfo, setOtherUserInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const previousMessagesLengthRef = useRef(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  // URL'den conversation ID'si varsa otomatik seç
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    const receiverId = searchParams.get('receiverId');
    
    if (conversationId) {
      const convId = Number(conversationId);
      
      // Önce conversation listesinde ara
      if (conversations.length > 0) {
        const conv = conversations.find(c => c.conversationId === convId);
        if (conv) {
          setSelectedConversation(conv);
          return;
        }
      }
      
      // Conversation listesinde yoksa, doğrudan conversation detaylarını yükle
      // Bu durumda manuel olarak bir conversation objesi oluştur
      const manualConv = {
        conversationId: convId,
        listingId: convId,
        otherUserId: receiverId ? Number(receiverId) : null, // URL'den veya fetchConversationDetails'te doldurulacak
      };
      setSelectedConversation(manualConv);
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      shouldScrollRef.current = false; // İlk yüklemede scroll yapma
      previousMessagesLengthRef.current = 0;
      fetchConversationDetails();
      // Her 3 saniyede bir mesajları yenile
      const interval = setInterval(() => {
        fetchConversationDetails();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, user?.userId, searchParams]);

  // Scroll kontrolü - sadece gerektiğinde scroll yap
  useEffect(() => {
    if (messages.length === 0) return;
    
    const container = messagesContainerRef.current;
    if (!container) return;

    // Yeni mesaj eklendi mi kontrol et
    const isNewMessage = messages.length > previousMessagesLengthRef.current;
    const previousLength = previousMessagesLengthRef.current;
    previousMessagesLengthRef.current = messages.length;

    // İlk yükleme mi kontrol et (önceki mesaj sayısı 0 ise)
    const isInitialLoad = previousLength === 0;

    // Scroll yapılmalı mı kontrol et
    // Sadece: 1) Mesaj gönderildiğinde (shouldScrollRef = true) VEYA
    //         2) Yeni mesaj geldiğinde VE kullanıcı zaten en alttaysa
    // İlk yüklemede scroll yapma
    if (!isInitialLoad && (shouldScrollRef.current || isNewMessage)) {
      // Kullanıcı en altta mı kontrol et (100px tolerans)
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Eğer yeni mesaj eklendiyse ve kullanıcı en alttaysa, scroll yap
      // Veya shouldScrollRef true ise (mesaj gönderildi)
      if (shouldScrollRef.current || (isNewMessage && isNearBottom)) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          shouldScrollRef.current = false; // Scroll yapıldı, bir sonraki için false yap
        }, 100);
      }
    }
  }, [messages]);

  // Scroll pozisyonunu izle - kullanıcı yukarı scroll yaparsa otomatik scroll'u durdur
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Kullanıcı yukarı scroll yapmışsa, otomatik scroll'u durdur
      if (!isNearBottom) {
        shouldScrollRef.current = false;
      } else {
        // Kullanıcı tekrar en alta gelirse, otomatik scroll'u aktif et
        shouldScrollRef.current = true;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedConversation]);

  const scrollToBottom = () => {
    shouldScrollRef.current = true;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      
      // Her conversation için listing ve kullanıcı bilgilerini getir
      const enrichedConversations = await Promise.all(
        data.map(async (conv) => {
          try {
            const listing = await listingService.getListingById(conv.listingId);
            const otherUserId = conv.otherUserId;
            let otherUserName = conv.otherUserName;
            
            // Kullanıcı bilgisini getir
            if (!otherUserName && otherUserId) {
              try {
                const userData = await authService.getUserById(otherUserId);
                otherUserName = `${userData.firstName} ${userData.lastName}`;
              } catch (error) {
                console.error('Kullanıcı bilgisi alınamadı:', error);
                otherUserName = `Kullanıcı ${otherUserId}`;
              }
            }
            
            return {
              ...conv,
              listingTitle: listing.title,
              listingImage: listing.imageUrl,
              otherUserName: otherUserName || `Kullanıcı ${otherUserId}`,
            };
          } catch (error) {
            console.error('Conversation bilgisi getirilemedi:', error);
            return conv;
          }
        })
      );
      
      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async () => {
    if (!selectedConversation) return;
    
    try {
      // Önce listing bilgisini getir (her zaman mevcut)
      const listing = await listingService.getListingById(selectedConversation.listingId);
      setListingInfo(listing);
      
      // Karşı tarafın bilgisini belirle
      let otherUserId = selectedConversation.otherUserId;
      
      // Eğer otherUserId yoksa, listing sahibinden veya URL'den al
      if (!otherUserId) {
        // URL'den receiverId'yi kontrol et
        const receiverId = searchParams.get('receiverId');
        if (receiverId) {
          otherUserId = Number(receiverId);
        } else {
          // Listing sahibi ile konuşuyorsak, listing sahibi otherUserId olur
          // Aksi halde, kullanıcı listing sahibi ise, request'ten alınmalı
          // Şimdilik listing sahibini otherUserId olarak kullan
          if (listing.userId !== user?.userId) {
            otherUserId = listing.userId;
          }
        }
      }
      
      // otherUserId hala yoksa, hata ver
      if (!otherUserId) {
        console.error('otherUserId bulunamadi');
        return;
      }
      
      // Kullanıcı bilgilerini al (geçici olarak)
      try {
        console.log('Kullanıcı bilgisi alınıyor, otherUserId:', otherUserId);
        const userData = await authService.getUserById(otherUserId);
        console.log('Kullanıcı bilgisi alındı:', userData);
        const fullName = `${userData.firstName} ${userData.lastName}`;
        console.log('Kullanıcı adı:', fullName);
        setOtherUserInfo({
          userId: otherUserId,
          name: fullName,
        });
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
        console.error('Hata detayları:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        setOtherUserInfo({
          userId: otherUserId,
          name: `Kullanıcı ${otherUserId}`,
        });
      }
      
      // Conversation'ı getirmeyi dene (eğer mesajlar varsa)
      try {
        const data = await messageService.getConversation(selectedConversation.conversationId, user?.userId);
        
        // Karşı tarafın bilgisini güncelle
        if (data.otherUserId) {
          otherUserId = data.otherUserId;
        }
        
        // Kullanıcı bilgilerini al
        let otherUserName = data.otherUserName;
        if (!otherUserName && otherUserId) {
          try {
            console.log('Conversation içinde kullanıcı bilgisi alınıyor, otherUserId:', otherUserId);
            const userData = await authService.getUserById(otherUserId);
            console.log('Conversation içinde kullanıcı bilgisi alındı:', userData);
            otherUserName = `${userData.firstName} ${userData.lastName}`;
            console.log('Conversation içinde kullanıcı adı:', otherUserName);
          } catch (error) {
            console.error('Conversation içinde kullanıcı bilgisi alınamadı:', error);
            console.error('Hata detayları:', {
              message: error.message,
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
            });
            otherUserName = `Kullanıcı ${otherUserId}`;
          }
        }
        
        setOtherUserInfo({
          userId: otherUserId,
          name: otherUserName || `Kullanıcı ${otherUserId}`,
        });
        
        setMessages(data.messages || []);
        
        // Mesajları okundu olarak işaretle
        if (data.unreadCount > 0) {
          await messageService.markAsRead(data.conversationId);
          fetchConversations(); // Conversation listesini yenile
        }
      } catch (convError) {
        // Conversation henüz oluşturulmamışsa (mesaj yoksa), sadece listing ve otherUser bilgisini ayarla
        console.log('Conversation henuz olusturulmamis, sadece listing bilgisi yuklendi');
        setMessages([]);
      }
    } catch (error) {
      console.error('Conversation detaylari yuklenirken hata:', error);
      // Hata durumunda bile listing bilgisini göster
      const receiverId = searchParams.get('receiverId');
      if (receiverId) {
        const receiverUserId = Number(receiverId);
        try {
          const userData = await authService.getUserById(receiverUserId);
          setOtherUserInfo({
            userId: receiverUserId,
            name: `${userData.firstName} ${userData.lastName}`,
          });
        } catch (userError) {
          console.error('Kullanıcı bilgisi alınamadı:', userError);
          setOtherUserInfo({
            userId: receiverUserId,
            name: `Kullanıcı ${receiverUserId}`,
          });
        }
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !otherUserInfo) {
      console.log('Mesaj gönderme validasyonu başarısız:', {
        newMessage: newMessage.trim(),
        selectedConversation,
        otherUserInfo
      });
      return;
    }

    try {
      setSending(true);
      const messageContent = newMessage.trim();
      console.log('Mesaj gönderiliyor:', {
        listingId: selectedConversation.conversationId,
        receiverId: otherUserInfo.userId,
        content: messageContent,
        user: user?.userId
      });
      
      const response = await messageService.sendMessage({
        listingId: selectedConversation.conversationId,
        receiverId: otherUserInfo.userId,
        content: messageContent,
      });

      console.log('Mesaj başarıyla gönderildi:', response);
      setNewMessage('');
      
      // Mesajları hemen yenile
      shouldScrollRef.current = true; // Mesaj gönderildiğinde scroll yap
      await fetchConversationDetails();
      await fetchConversations();
    } catch (error) {
      console.error('Mesaj gonderilirken hata:', error);
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      });
      
      let errorMessage = 'Mesaj gönderilirken bir hata oluştu';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Hata: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Sol Panel - Conversation Listesi */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
                <h2 className="text-2xl font-bold text-gray-900">Mesajlarım</h2>
                <p className="text-sm text-gray-600 mt-1">{conversations.length} konuşma</p>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Henüz mesajınız yok</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {conversations.map((conv) => (
                      <button
                        key={conv.conversationId}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation?.conversationId === conv.conversationId
                            ? 'bg-primary-50 border-l-4 border-primary-600'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {conv.listingImage ? (
                              <img src={conv.listingImage} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              'İ'
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conv.otherUserName || `Kullanıcı ${conv.otherUserId}`}
                              </h3>
                              {conv.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-1">{conv.listingTitle}</p>
                            {conv.lastMessage && (
                              <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                            )}
                            {conv.lastMessageTime && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(conv.lastMessageTime).toLocaleDateString('tr-TR', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Panel - Mesajlaşma */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                      {listingInfo?.imageUrl && (
                        <img
                          src={listingInfo.imageUrl}
                          alt={listingInfo.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{listingInfo?.title || 'İlan'}</h3>
                        <p className="text-sm text-gray-600">
                          {otherUserInfo?.name || `Kullanıcı ${selectedConversation.otherUserId}`} ile konuşuyorsunuz
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mesajlar */}
                  <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.userId;
                      return (
                        <div
                          key={message.messageId}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                              isOwn
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-primary-100' : 'text-gray-400'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Mesaj Gönderme Formu */}
                  <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 text-gray-900"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? 'Gönderiliyor...' : 'Gönder'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 text-lg">Bir konuşma seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
