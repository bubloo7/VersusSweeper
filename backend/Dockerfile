# syntax=docker/dockerfile:1

############################
# Base
############################
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
# tini for proper signal handling / zombie reaping
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

############################
# Dependencies
############################
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

############################
# Development (hot reload via nodemon)
############################
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]

############################
# Production
############################
FROM base AS prod
# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY index.js ./
EXPOSE 3001
USER node
CMD ["node", "index.js"]
