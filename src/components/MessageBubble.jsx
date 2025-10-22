import { Bot, User } from 'lucide-react';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'bg-cyan-500/10 border-cyan-400/30'
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center gap-2 mb-2 opacity-80 text-xs">
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
          <span className="uppercase tracking-wide">{isUser ? 'You' : 'Assistant'}</span>
        </div>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}
