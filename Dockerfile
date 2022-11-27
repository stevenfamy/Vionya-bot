FROM node:18.12.0-alpine3.16
RUN apk add --no-cache ffmpeg
RUN mkdir -p /home/node/app/node_modules && chown -R root:root /home/node/app
WORKDIR /home/node/app
COPY package*.json ./

USER root
RUN npm install
COPY --chown=root:root . .

EXPOSE 80
EXPOSE 443

CMD [ "node", "app.js" ]