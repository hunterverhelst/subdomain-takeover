FROM node:latest as build

COPY freeirc/ /freeirc

WORKDIR /freeirc

RUN npm install
RUN npm run build


FROM nginx:latest

COPY --from=build /freeirc/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
