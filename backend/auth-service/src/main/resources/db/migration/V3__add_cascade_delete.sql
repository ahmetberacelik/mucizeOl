-- Foreign key constraint'leri CASCADE DELETE yapmak için güncelle
-- Bu sayede ilan silindiğinde, ilgili adoption_requests ve messages kayıtları da otomatik silinir

-- Önce mevcut constraint'leri kaldır
ALTER TABLE adoption_requests DROP FOREIGN KEY fk_requests_listing;
ALTER TABLE messages DROP FOREIGN KEY fk_messages_listing;

-- CASCADE DELETE ile yeniden oluştur
ALTER TABLE adoption_requests 
ADD CONSTRAINT fk_requests_listing 
FOREIGN KEY (listing_id) REFERENCES listings (listing_id) 
ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT fk_messages_listing 
FOREIGN KEY (conversation_id) REFERENCES listings (listing_id) 
ON DELETE CASCADE;

