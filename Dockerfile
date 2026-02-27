FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY music/ /usr/share/nginx/html/music/
COPY images/ /usr/share/nginx/html/images/
COPY projects/ /usr/share/nginx/html/projects/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
