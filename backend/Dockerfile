FROM node:18-alpine AS builder

LABEL maintainer="TRADEY Team"
LABEL version="1.0"
LABEL description="TRADEY Backend - Express API sa Firebase Admin SDK"

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm install && \
    npm cache clean --force

COPY . .

RUN npm run build

FROM node:18-alpine

LABEL maintainer="TRADEY Team"
LABEL version="1.0"
LABEL description="TRADEY Backend Production"

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

RUN chown -R nodejs:nodejs /app

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

USER nodejs

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/server.js"]

