FROM node:22-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ .
COPY database/schema.sql ./database/schema.sql
COPY database/migrations ./database/migrations

EXPOSE 3000

CMD ["npm", "start"]
