FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy both nginx configs
COPY nginx.conf /etc/nginx/nginx-http.conf
COPY nginx-ssl.conf /etc/nginx/nginx-ssl.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
