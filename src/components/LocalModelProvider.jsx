import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LocalModelContext = createContext(null);

const defaultSettings = {
  apiType: 'ollama', // 'ollama' | 'openai'
  baseUrl: 'http://localhost:11434',
  model: 'llama3.1',
  apiKey: '',
  temperature: 0.2,
};

export function LocalModelProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const s = localStorage.getItem('local-model-settings');
      return s ? { ...defaultSettings, ...JSON.parse(s) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('local-model-settings', JSON.stringify(settings));
  }, [settings]);

  const client = useMemo(() => createClient(settings), [settings]);

  const value = {
    settings,
    setSettings,
    sendMessage: (messages, { signal } = {}) => client.sendMessage(messages, { signal }),
    testConnection: () => client.testConnection(),
  };

  return (
    <LocalModelContext.Provider value={value}>{children}</LocalModelContext.Provider>
  );
}

export function useLocalModel() {
  const ctx = useContext(LocalModelContext);
  if (!ctx) throw new Error('useLocalModel must be used within LocalModelProvider');
  return ctx;
}

function createClient(settings) {
  const { apiType, baseUrl, model, apiKey, temperature } = settings;

  if (apiType === 'openai') {
    return {
      async testConnection() {
        try {
          const res = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/models`, {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          return res.ok;
        } catch {
          return false;
        }
      },
      async sendMessage(messages, { signal } = {}) {
        const payload = {
          model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature,
          stream: false,
        };
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
          signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content ?? '';
        return text;
      },
    };
  }

  // Default to Ollama
  return {
    async testConnection() {
      try {
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`);
        return res.ok;
      } catch {
        return false;
      }
    },
    async sendMessage(messages, { signal } = {}) {
      // Prefer chat endpoint for multi-turn
      const payload = {
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
        options: { temperature },
      };
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal,
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const text = data.message?.content ?? data.response ?? '';
      return text;
    },
  };
}
