
FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]