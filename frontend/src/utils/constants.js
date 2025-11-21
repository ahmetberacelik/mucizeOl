// API Base URL yapılandırması:
// 1. VITE_API_BASE_URL environment variable set edilmişse onu kullan
// 2. Yoksa relative path kullan (/api/v1) - hem development hem production'da çalışır
//    - Development: Vite proxy yönlendirir
//    - Production: Nginx reverse proxy yönlendirir
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const TOKEN_KEY = 'mucizeol_access_token';
export const REFRESH_TOKEN_KEY = 'mucizeol_refresh_token';

export const LISTING_STATUS = {
  AVAILABLE: 'Mevcut',
  ADOPTED: 'Sahiplendirildi',
  PENDING: 'Askıda'
};

export const REQUEST_STATUS = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi'
};

export const GENDER_OPTIONS = [
  { value: 'Erkek', label: 'Erkek' },
  { value: 'Dişi', label: 'Dişi' }
];

