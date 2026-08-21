import React, { useState } from 'react';
import { Bell, X, CheckCircle2, Send } from 'lucide-react';

export default function WebhookModal({ isOpen, onClose }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const testAlert = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4">
      <div className="bg-ink-900 border border-ink-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-mono font-bold text-paper-100">Webhook Trap Alerts</h3>
          </div>
          <button onClick={onClose} className="text-paper-400 hover:text-paper-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-paper-400 font-mono">
          Configure a Discord or Slack webhook URL to receive instant push alerts whenever a contract trap or panic is observed on-chain.
        </p>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
          className="w-full bg-ink-950 border border-ink-800 rounded-lg px-3 py-2.5 text-xs font-mono text-paper-200 focus:outline-none focus:border-teal-500"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={testAlert}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-ink-950 font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            {sent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {sent ? "Test Alert Sent!" : "Send Test Webhook"}
          </button>
        </div>
      </div>
    </div>
  );
}
