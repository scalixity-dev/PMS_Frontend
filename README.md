# SmartTenantAI_Frontend
Property Management Software Frontend

## Environment Variables

Add these to your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AI_CHAT_API_URL=http://localhost:8000
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/86cfe5f2-a69d-44c0-b89e-a138126900ed
```

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_AI_CHAT_API_URL`: FastAPI RAG pipeline URL (for non-authenticated users)
- `VITE_N8N_WEBHOOK_URL`: n8n webhook URL (for authenticated users)
