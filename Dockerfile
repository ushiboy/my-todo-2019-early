FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y locales && \
    locale-gen en_US.UTF-8

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN sed -i.bak -e "s%http://archive.ubuntu.com%http://jp.archive.ubuntu.com%g" /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y unzip wget git curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs && \
    mkdir /.npm && \
    chmod 777 /.npm && \
    mkdir /.config && \
    chmod -R 777 /.config
