# CI/CD — PMS Frontend (Vite/React)

## Overview

Zero-downtime deployment via GitHub Actions over SSH.
Each deploy builds a new Docker image, health-checks it before going live, and auto-rollbacks if the check fails — the old container is never stopped unless the new one is confirmed healthy.

## Workflow file

`.github/workflows/deploy.yml`

## Triggers

| Event | Condition | Result |
|-------|-----------|--------|
| Push to `main` | Any commit | Auto deploy |
| PR merged into `main` | `merged == true` | Auto deploy |
| `workflow_dispatch` | Manual, input a branch name | Deploy that branch |

## Deployment Flow

```
git pull (target branch)
        |
  docker build (with VITE_ build args)
        |
  docker run (probe port 5740) — NEW container
        |
  Health check loop (18 × 5s = 90s max)
       / \
  PASS   FAIL
   |       |
   |     docker rm NEW   ← rollback
   |     old container keeps running
   |     pipeline exits with error
   |
  docker rm OLD container
  docker run NEW on port 5741 (production)
  docker rmi old images (keep last 3)
```

## Zero-Downtime Strategy

- New container starts on **probe port 5740** first
- Health check via Docker `HEALTHCHECK` or HTTP probe to `localhost:5740/`
- Only after passing does the old container get removed
- New container is re-launched on production port **5741** with the proper name

## Rollback

Automatic. If the new container fails health checks:
1. New container is removed
2. New image is deleted
3. Old container continues running untouched
4. Pipeline fails with a clear log message

## Required GitHub Secrets

Set these in **Settings → Secrets → Actions** of this repo:

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Server IP or hostname |
| `SSH_USER` | Deploy user (e.g. `ubuntu`) |
| `SSH_KEY` | Private SSH key (PEM format) |
| `SSH_PORT` | SSH port (optional, default `22`) |
| `DEPLOY_DIR` | Absolute path on server (e.g. `/opt/pms/frontend`) |

## Build-time Environment Variables

These must be available as environment variables on the **server** at build time (in `.env` or exported in the shell):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_CHAT_API_BASE_URL` | Chat API base URL |
| `VITE_CHAT_WS_URL` | Chat WebSocket URL |
| `VITE_GEOAPIFY_API_KEY` | Geoapify map API key |
| `VITE_N8N_WEBHOOK_URL` | n8n webhook URL |
| `VITE_N8N_RAG_CHAT_URL` | n8n RAG chat URL |

> These are baked into the bundle at build time. Store them in `.env` on the server inside `DEPLOY_DIR`.

## One-Time Server Setup

```bash
# Repo is already cloned at:
# ~/smarttenantai/PMS_Frontend

# Set DEPLOY_DIR secret to:
# /home/ubuntu/smarttenantai/PMS_Frontend

# Place/update the .env file in DEPLOY_DIR with VITE_ variables

# Ensure the deploy user can run Docker
sudo usermod -aG docker $USER
```

## Manual Deploy (any branch)

Go to **Actions → Deploy Frontend → Run workflow**, enter the branch name, and click **Run workflow**.

## Ports

| Port | Purpose |
|------|---------|
| `5741` | Production (external) |
| `5740` | Probe port during health check only (ephemeral) |
