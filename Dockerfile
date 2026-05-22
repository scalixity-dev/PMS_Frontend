# ============================================
# Stage 1: Build
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source and config
COPY . .

# Build arguments for Vite env vars
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
FROM node:22-alpine AS runner

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5741

# Start server
CMD ["serve", "-s", "dist", "-l", "5741"]