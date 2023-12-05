FROM nginx:latest

RUN apt update && apt install -y \
 nodejs \
 npm

#COPY freeirc/build/ /usr/share/nginx/html
COPY server/ /src/
WORKDIR /src/

RUN npm install



