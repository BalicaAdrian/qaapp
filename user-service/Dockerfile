
FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]