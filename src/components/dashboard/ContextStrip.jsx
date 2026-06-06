import { useMemo, useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { contextTips, getDashboardStats } from '../../data/mock';

export default function ContextStrip() {
  const [visible, setVisible] = useState(true);
  const stats = useMemo(() => getDashboardStats(), []);

  const tip = useMemo(() => {
    if (stats.scheduledCount > 0) {
      return `You have ${stats.scheduledCount} post${stats.scheduledCount === 1 ? '' : 's'} in the queue. ${contextTips[1]}`;
    }
    if (stats.connectedCount === 0) {
      return 'Link your first account to start scheduling from one place.';
    }
    return contextTips[Math.floor(Math.random() * contextTips.length)];
  }, [stats.connectedCount, stats.scheduledCount]);

  if (!visible) return null;

  return (
    <div className="context-strip">
      <div className="context-strip-copy">
        <Lightbulb size={16} />
        <p>{tip}</p>
      </div>
      <button type="button" className="icon-btn" aria-label="Dismiss tip" onClick={() => setVisible(false)}>
        <X size={14} />
      </button>
    </div>
  );
}
