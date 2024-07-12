FROM nginx:alpine
COPY . /usr/share/nginx/html

COPY index.html /var/www/html/
COPY styles.css /var/www/html/
COPY scripts.js /var/www/html/