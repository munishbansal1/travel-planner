FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL deps (including dev) for the build step
COPY package*.json ./
RUN npm ci

# Copy source and build frontend
COPY . .
RUN npm run build

# ── Production image ──────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Only production deps in final image
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server source and the built frontend
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the Express server (serves API + built frontend)
CMD ["node", "server.js"]
