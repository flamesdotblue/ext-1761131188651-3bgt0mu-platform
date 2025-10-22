import { useEffect, useState } from 'react';
import { useLocalModel } from './LocalModelProvider.jsx';
import { X, CheckCircle2, AlertCircle, Key, Server, Settings } from 'lucide-react';

export default function SettingsPanel({ open, onClose }) {
  const { settings, setSettings, testConnection } = useLocalModel();
  const [local, setLocal] = useState(settings);
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState(null);

  useEffect(() => {
    if (open) {
      setLocal(settings);
      setTestOk(null);
    }
  }, [open, settings]);

  function save() {
    setSettings(local);
    onClose?.();
  }

  async function handleTest() {
    setTesting(true);
    setTestOk(null);
    try {
      const ok = await testConnection();
      setTestOk(ok);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'} flex`}
      aria-hidden={!open}
    >
      <div
        className={`transition-opacity duration-200 bg-black/60 w-full h-full ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[480px] bg-neutral-950 border-l border-white/10 shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="font-semibold">Connection Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-white/10" aria-label="Close settings">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-neutral-300">API Type</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setLocal(s => ({ ...s, apiType: 'ollama' }))}
                className={`rounded-md border px-3 py-2 text-sm ${local.apiType === 'ollama' ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/10 bg-white/5'}`}
              >
                Ollama
              </button>
              <button
                onClick={() => setLocal(s => ({ ...s, apiType: 'openai' }))}
                className={`rounded-md border px-3 py-2 text-sm ${local.apiType === 'openai' ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/10 bg-white/5'}`}
              >
                OpenAI-compatible
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-neutral-300 flex items-center gap-2"><Server className="h-4 w-4" /> Base URL</label>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                value={local.baseUrl}
                onChange={(e) => setLocal(s => ({ ...s, baseUrl: e.target.value }))}
                placeholder={local.apiType === 'ollama' ? 'http://localhost:11434' : 'http://localhost:8080/v1'}
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Model</label>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                value={local.model}
                onChange={(e) => setLocal(s => ({ ...s, model: e.target.value }))}
                placeholder={local.apiType === 'ollama' ? 'llama3.1' : 'gpt-4o-mini'}
              />
            </div>

            {local.apiType === 'openai' && (
              <div>
                <label className="text-sm text-neutral-300 flex items-center gap-2"><Key className="h-4 w-4" /> API Key</label>
                <input
                  className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  value={local.apiKey}
                  onChange={(e) => setLocal(s => ({ ...s, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  type="password"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-neutral-300">Temperature</label>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                value={local.temperature}
                onChange={(e) => setLocal(s => ({ ...s, temperature: Number(e.target.value) }))}
                placeholder="0.2"
                type="number"
                step="0.1"
                min="0"
                max="2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTest}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
              disabled={testing}
            >
              Test connection
            </button>
            {testOk === true && (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-sm"><CheckCircle2 className="h-4 w-4" /> Connected</span>
            )}
            {testOk === false && (
              <span className="inline-flex items-center gap-1 text-red-400 text-sm"><AlertCircle className="h-4 w-4" /> Failed</span>
            )}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/10 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Cancel</button>
          <button onClick={save} className="rounded-md border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm hover:bg-cyan-500/20">Save</button>
        </div>
      </div>
    </div>
  );
}
