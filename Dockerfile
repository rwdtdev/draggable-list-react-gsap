FROM node:alpine

WORKDIR /app

EXPOSE 3002

COPY ./ ./

RUN npm install

CMD ["node", "server.js"]