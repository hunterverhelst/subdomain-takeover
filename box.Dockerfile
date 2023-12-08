FROM ubuntu:latest
RUN apt update && apt install -y \
    curl \
    vim \
    irssi \
    dnsutils \
    iputils-ping 

RUN useradd -ms /bin/bash kali
USER kali
WORKDIR /home/kali