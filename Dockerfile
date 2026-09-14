FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p /app/uploads/Products \
    /app/uploads/Categories \
    /app/uploads/Users \
    /app/uploads/Brands

RUN chmod -R 777 /app/uploads

EXPOSE 5000

CMD ["npm", "run", "start:prod"]