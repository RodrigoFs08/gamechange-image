# Dockerfile para gamechangeimages
FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"] 