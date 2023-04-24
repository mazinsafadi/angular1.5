FROM dockercentral.it.att.com:5100/com.att.ajsc.public/node:8.11.1-alpine

# Create app directory

RUN mkdir -p /opt/app/udas/test/
WORKDIR /opt/app/udas/test/

# Bundle app source
COPY . /opt/app/udas/test/

EXPOSE 2019
CMD [ "node", "server.js" ]
