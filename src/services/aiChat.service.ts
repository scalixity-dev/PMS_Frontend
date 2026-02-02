export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type StreamChunk = {
  content: string;
  thread_id: string;
};

class AIChatService {
  private baseUrl: string;
  private n8nWebhookUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_AI_CHAT_API_URL || 'http://localhost:8000';
    this.n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/86cfe5f2-a69d-44c0-b89e-a138126900ed';
  }

  async sendMessage(
    query: string,
    threadId: string | null,
    onChunk: (chunk: string) => void,
    onComplete: (threadId: string) => void,
    onError: (error: Error) => void,
    useN8n: boolean = false,
    userEmail?: string
  ): Promise<void> {
    if (useN8n) {
      return this.sendMessageToN8n(query, threadId, onChunk, onComplete, onError, userEmail);
    }
    return this.sendMessageToFastAPI(query, threadId, onChunk, onComplete, onError);
  }

  private async sendMessageToFastAPI(
    query: string,
    threadId: string | null,
    onChunk: (chunk: string) => void,
    onComplete: (threadId: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          thread_id: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentThreadId: string | null = threadId;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              if (currentThreadId) {
                onComplete(currentThreadId);
              }
              return;
            }

            try {
              const parsed: StreamChunk = JSON.parse(data);
              
              if (parsed.thread_id) {
                currentThreadId = parsed.thread_id;
              }

              if (parsed.content) {
                onChunk(parsed.content);
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError);
            }
          }
        }
      }

      if (currentThreadId) {
        onComplete(currentThreadId);
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  }

  private async sendMessageToN8n(
    query: string,
    threadId: string | null,
    onChunk: (chunk: string) => void,
    onComplete: (threadId: string) => void,
    onError: (error: Error) => void,
    userEmail?: string
  ): Promise<void> {
    try {
      const requestBody: Record<string, unknown> = {
        query,
        thread_id: threadId,
      };

      if (userEmail) {
        requestBody.email = userEmail;
      }

      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentThreadId: string | null = threadId;
      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          try {
            const parsed = JSON.parse(trimmedLine);
            
            if (parsed.type === 'item' && parsed.content) {
              hasReceivedContent = true;
              onChunk(parsed.content);
            } else if (parsed.type === 'end') {
              if (currentThreadId) {
                onComplete(currentThreadId);
              } else if (threadId) {
                onComplete(threadId);
              } else {
                onComplete(this.generateThreadId());
              }
              return;
            } else if (parsed.thread_id) {
              currentThreadId = parsed.thread_id;
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (parseError) {
            continue;
          }
        }
      }

      if (currentThreadId) {
        onComplete(currentThreadId);
      } else if (threadId) {
        onComplete(threadId);
      } else {
        onComplete(this.generateThreadId());
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  }

  generateThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiChatService = new AIChatService();
