FROM ubuntu:latest
RUN apt update && apt install -y \
curl \
vim \
irssi \
dnsutils \
iputils-ping 