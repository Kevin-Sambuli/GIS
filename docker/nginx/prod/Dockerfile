# The first stage
# Build React static files
FROM node:19.2.0-alpine as builder

WORKDIR /web

COPY ./package.json .

COPY ./package-lock.json .

COPY . .

RUN npm run build


# The second stage
# Copy React static files and start nginx
FROM nginx:stable-alpine

RUN apt-get update

# shared volume with django static and media folders refrenced in the docker compose
RUN mkdir -p /home/api/static

RUN mkdir -p /home/api/media

RUN mkdir -p /home/web

#WORKDIR /usr/share/nginx/html

# COPY --from=builder /web/build /usr/share/nginx/html
COPY --from=builder /web/build /home/web

RUN rm /etc/nginx/conf.d/default.conf

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




FROM nginx:latest

RUN apt-get update


# Making root folder
RUN mkdir /react_build

# shared volume with django static and media folders refrenced in the docker compose
RUN mkdir -p /home/api/static

RUN mkdir -p /home/api/media

#COPY /build/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./default.conf /etc/nginx/conf.d/default.conf



