FROM nginx:latest

RUN apt-get update

# Making root folder
RUN mkdir -p /home/web

# shared volume with django static and media folders refrenced in the docker compose
RUN mkdir -p /home/api/static

RUN mkdir -p /home/api/media

RUN rm /etc/nginx/conf.d/default.conf

COPY ./default.conf /etc/nginx/conf.d/default.conf

# Install Certbot
RUN apt install certbot python3-certbot-nginx -y



