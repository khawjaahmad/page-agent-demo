import { useState } from 'react';
import { getOrCreatePageAgent } from '../services/pageAgent';

export function AIAgentButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleClick = () => {
    const { panel } = getOrCreatePageAgent(() => setIsPanelOpen(false));
    const shouldOpen = panel.wrapper.style.display === 'none';

    if (shouldOpen) {
      panel.show();
    } else {
      panel.hide();
    }
    setIsPanelOpen(shouldOpen);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-3 left-3 z-9999 flex items-center gap-1 px-2 py-1 rounded border border-border bg-black/80 backdrop-blur-sm hover:border-accent/50 transition-all"
      aria-label="Toggle Page Agent"
    >
      <span
        className="text-[10px] font-medium"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Page-Agent
      </span>
      {isPanelOpen && (
        <span className="w-1 h-1 rounded-full bg-accent animate-pulse"></span>
      )}
    </button>
  );
}
