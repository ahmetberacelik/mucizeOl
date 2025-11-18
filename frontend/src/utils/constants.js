export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

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

