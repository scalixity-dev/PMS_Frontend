# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files (pnpm)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

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
RUN pnpm build


# ============================================
# Stage 2: Serve (minimal runtime)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install serve globally
RUN pnpm add serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5741

# Start server
CMD ["serve", "-s", "dist", "-l", "5741"]