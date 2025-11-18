import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setPendingCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const requests = await requestService.getMyListingsRequests();
        const pending = requests.filter(req => req.status === 'Beklemede').length;
        setPendingCount(pending);
      } catch (error) {
        console.error('Bildirimler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Her 30 saniyede bir kontrol et
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return { pendingCount, loading };
};

