FROM node:latest

#COPY freeirc/build/ /usr/share/nginx/html
COPY server/ /src/
WORKDIR /src/

RUN npm install


ENTRYPOINT [ "npm", "start" ]
