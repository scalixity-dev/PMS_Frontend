# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production + dev for build)
RUN npm cache clean --force && npm ci

# Copy source and config
COPY . .

# Build arguments for Vite env vars (passed at build time)
ARG VITE_API_BASE_URL
ARG VITE_CHAT_API_BASE_URL
ARG VITE_CHAT_WS_URL
ARG VITE_GEOAPIFY_API_KEY
ARG VITE_N8N_WEBHOOK_URL
ARG VITE_N8N_RAG_CHAT_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CHAT_API_BASE_URL=$VITE_CHAT_API_BASE_URL
ENV VITE_CHAT_WS_URL=$VITE_CHAT_WS_URL
ENV VITE_GEOAPIFY_API_KEY=$VITE_GEOAPIFY_API_KEY
ENV VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL
ENV VITE_N8N_RAG_CHAT_URL=$VITE_N8N_RAG_CHAT_URL

# Build the app
RUN npm run build

# ============================================
# Stage 2: Serve (minimal runtime)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install serve globally (lightweight static file server with SPA support)
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5741

# Serve with SPA mode (-s) for client-side routing, listen on all interfaces
CMD ["serve", "-s", "dist", "-l", "5741"]
