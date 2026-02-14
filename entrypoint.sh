#!/bin/sh

# Check if SSL certificates exist
if [ -f /etc/letsencrypt/live/shahzodnematov.uz/fullchain.pem ]; then
    echo "SSL certificates found, using HTTPS config"
    cp /etc/nginx/nginx-ssl.conf /etc/nginx/conf.d/default.conf
else
    echo "No SSL certificates found, using HTTP config"
    cp /etc/nginx/nginx-http.conf /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
