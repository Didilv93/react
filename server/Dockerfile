# Build context is the repository root: the server imports the shared
# protocol types from src/interfaces/market.ts.
FROM node:22-alpine

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/*.ts ./
COPY src/interfaces/market.ts /app/src/interfaces/market.ts

ENV PORT=8080
EXPOSE 8080

USER node
CMD ["npm", "start"]
