import { useCallback, useEffect, useRef, useState } from 'react';

export interface QueuedMessage {
  conversationId: string;
  content: string;
  id?: string;
}

const STORAGE_KEY = 'pms_chat_offline_queue';

function loadQueue(): QueuedMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

function saveQueue(queue: QueuedMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {}
}

type SendFn = (content: string, convId?: string) => boolean;

export function useOfflineQueue(isConnected: boolean, sendMessage: SendFn) {
  const [queue, setQueue] = useState<QueuedMessage[]>(() => loadQueue());
  const queueRef = useRef<QueuedMessage[]>(queue);
  queueRef.current = queue;
  const sendRef = useRef(sendMessage);
  sendRef.current = sendMessage;

  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  const flush = useCallback(() => {
    const toSend = [...queueRef.current];
    if (toSend.length === 0) return;

    setQueue([]);
    toSend.forEach(({ conversationId, content }) => {
      sendRef.current(content, conversationId);
    });
  }, []);

  useEffect(() => {
    if (isConnected && queueRef.current.length > 0) {
      flush();
    }
  }, [isConnected, flush]);

  const enqueue = useCallback((conversationId: string, content: string) => {
    const id = `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setQueue((prev) => [...prev, { conversationId, content, id }]);
  }, []);

  const trySend = useCallback(
    (conversationId: string, content: string): boolean => {
      const sent = sendRef.current(content, conversationId);
      if (!sent) {
        enqueue(conversationId, content);
        return false;
      }
      return true;
    },
    [enqueue]
  );

  const pendingCount = queue.length;
  const pendingForConv = useCallback(
    (conversationId: string) => queue.filter((q) => q.conversationId === conversationId),
    [queue]
  );

  return { trySend, enqueue, pendingCount, pendingForConv, flush };
}
