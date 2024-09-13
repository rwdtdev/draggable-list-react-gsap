FROM node:alpine

WORKDIR /app

EXPOSE 3002

COPY ./ ./

RUN npm install

RUN npm run build

CMD ["node", "server.js"]