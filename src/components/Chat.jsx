import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useLocalModel } from './LocalModelProvider.jsx';
import MessageBubble from './MessageBubble.jsx';

export default function Chat() {
  const { sendMessage, settings } = useLocalModel();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `You're connected to a ${settings.apiType === 'ollama' ? 'local Ollama' : 'OpenAI-compatible'} server. Ask anything!` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function stop() {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setLoading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const userMsg = { role: 'user', content };
    const draft = [...messages, userMsg];
    setMessages(draft);
    setInput('');
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const reply = await sendMessage(draft, { signal: controller.signal });
      setMessages(prev => [...prev, { role: 'assistant', content: reply || '⚠️ Empty response' }]);
    } catch (err) {
      const note = `Request failed. ${err?.message || ''}`;
      setMessages(prev => [...prev, { role: 'assistant', content: note }]);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur p-3 md:p-4">
      <div ref={listRef} className="h-[48vh] md:h-[56vh] overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-xs text-neutral-400 animate-pulse mb-2">Model is thinking…</div>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${settings.model}`}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm hover:bg-cyan-500/20 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
        {loading && (
          <button type="button" onClick={stop} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Stop</button>
        )}
      </form>

      <div className="mt-2 text-[11px] text-neutral-400">
        Using {settings.apiType === 'ollama' ? 'Ollama' : 'OpenAI-compatible'} at {settings.baseUrl} · Model: {settings.model}
      </div>
    </section>
  );
}
