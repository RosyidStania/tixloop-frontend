FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all files and build the app
COPY . .
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app

# Copy the built output from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["node", "build/index.js"]
