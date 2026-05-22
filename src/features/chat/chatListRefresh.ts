/** Lightweight pub/sub so ChatPage can refresh Sidebar /my-chats without remounting. */

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeChatListRefresh(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function requestChatListRefresh(): void {
  for (const listener of listeners) {
    listener();
  }
}
