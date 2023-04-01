FROM node:18.15.0-bullseye

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        unzip \
        wget && \
    apt-get autoremove -y && \
    apt-get clean && \
	rm -rf /var/lib/apt/lists/*
ARG TERRAFORM_VERSION=1.4.4
RUN wget --progress=dot:mega https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
	unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
	mv terraform /usr/local/bin/ && \
	chmod +x /usr/local/bin/terraform && \
	terraform --version
RUN npm install -g \
        cdktf-cli
