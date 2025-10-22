import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Chat from './components/Chat.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import { LocalModelProvider } from './components/LocalModelProvider.jsx';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <LocalModelProvider>
      <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
        <Header onOpenSettings={() => setSettingsOpen(true)} />
        <main className="flex-1">
          <Hero />
          <div className="container mx-auto px-4 md:px-6 max-w-5xl -mt-20 relative z-10">
            <Chat />
          </div>
        </main>
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </LocalModelProvider>
  );
}
