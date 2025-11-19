# Frontend Production Build
FROM node:18-alpine AS builder

WORKDIR /app

# Bağımlılıkları kur
COPY package*.json ./
RUN npm ci

# Uygulamayı build et
COPY . .
RUN npm run build

# Production - Nginx ile serve et
FROM nginx:alpine

# Build edilen dosyaları kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config (SPA için)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


