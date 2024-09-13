FROM node:latest

WORKDIR /app

EXPOSE 5173

COPY ./ ./

RUN npm install

CMD ["npx", "vite", "--host"]