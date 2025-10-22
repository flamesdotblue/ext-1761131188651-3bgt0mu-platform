import { Settings } from 'lucide-react';

export default function Header({ onOpenSettings }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur bg-neutral-950/70">
      <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-cyan-400 to-indigo-500" />
          <span className="font-semibold tracking-tight">Local Chat Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
