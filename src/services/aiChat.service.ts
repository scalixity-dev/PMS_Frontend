export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type StreamChunk = {
  content?: string;
  thread_id?: string;
  error?: string;
};

class AIChatService {
  private baseUrl: string;
  private n8nRagChatUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_AI_CHAT_API_URL || 'http://localhost:8000';
    this.n8nRagChatUrl = import.meta.env.VITE_N8N_RAG_CHAT_URL || '';
  }

  async sendMessage(
    query: string,
    threadId: string | null,
    onChunk: (chunk: string) => void,
    onComplete: (threadId: string) => void,
    onError: (error: Error) => void,
    useN8n: boolean = true,
    userEmail?: string
  ): Promise<void> {
    if (useN8n && this.n8nRagChatUrl) {
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
    if (!this.n8nRagChatUrl) {
      onError(new Error('N8N RAG Chat URL is not configured. Please set VITE_N8N_RAG_CHAT_URL in your environment variables.'));
      return;
    }

    try {
      const requestBody: Record<string, unknown> = {
        query,
        thread_id: threadId,
      };

      if (userEmail) {
        requestBody.email = userEmail;
      }

      const response = await fetch(this.n8nRagChatUrl, {
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
        const rawText = await response.text();
        const data = JSON.parse(rawText);
        if (data && typeof data.output === 'string') {
          onChunk(data.output);
          onComplete(threadId || this.generateThreadId());
          return;
        }
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      const finalThreadId = threadId || this.generateThreadId();

      type N8nStreamEvent = {
        type?: string;
        content?: string;
        error?: string;
      };

      const extractNextJsonObject = (text: string): { object: string | null; rest: string } => {
        const startIndex = text.indexOf('{');
        if (startIndex === -1) {
          return { object: null, rest: text };
        }

        let depth = 0;
        let inString = false;
        let escape = false;

        for (let i = startIndex; i < text.length; i += 1) {
          const char = text[i];

          if (escape) {
            escape = false;
            continue;
          }

          if (char === '\\') {
            escape = true;
            continue;
          }

          if (char === '"') {
            inString = !inString;
            continue;
          }

          if (inString) {
            continue;
          }

          if (char === '{') {
            depth += 1;
            continue;
          }

          if (char === '}') {
            depth -= 1;
            if (depth === 0) {
              const object = text.slice(startIndex, i + 1);
              const rest = text.slice(i + 1);
              return { object, rest };
            }
          }
        }

        return { object: null, rest: text };
      };

      const processEvent = (rawObject: string): boolean => {
        const trimmed = rawObject.trim();
        if (!trimmed) return false;

        try {
          const parsed = JSON.parse(trimmed) as N8nStreamEvent;

          if (parsed.type === 'item' && typeof parsed.content === 'string' && parsed.content.length > 0) {
            onChunk(parsed.content);
          } else if (parsed.type === 'end') {
            onComplete(finalThreadId);
            return true;
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e) {
          if (e instanceof SyntaxError) return false;
          throw e;
        }

        return false;
      };

      const processBuffer = (): boolean => {
        while (true) {
          const { object, rest } = extractNextJsonObject(buffer);
          if (!object) break;

          buffer = rest;
          if (processEvent(object)) {
            return true;
          }
        }
        return false;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        if (processBuffer()) return;
      }

      if (processBuffer()) return;

      const remaining = buffer.trim();
      if (remaining) {
        try {
          const data = JSON.parse(remaining);
          if (data && typeof data.output === 'string') {
            onChunk(data.output);
          }
        } catch {
          // not output format, skip
        }
      }

      onComplete(finalThreadId);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  }

  generateThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiChatService = new AIChatService();
