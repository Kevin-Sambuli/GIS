FROM node:19.2.0-alpine

WORKDIR /web

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

#CMD ['npm', 'run', 'build']
