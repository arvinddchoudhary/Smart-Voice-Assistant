
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

EXPOSE 8081

CMD ["npm", "run", "web"]
