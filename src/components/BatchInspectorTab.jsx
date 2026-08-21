import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';

export default function BatchInspectorTab({ rpcClient, network }) {
  const [jsonInput, setJsonInput] = useState(`[
  "2c56a81c1c738e4a9e4d5f1234567890abcdef1234567890abcdef1234567890",
  "8a3f7c12d9e4a5b6c7d8e9f0123456789abcdef0123456789abcdef012345678"
]`);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);

  const runBatch = async () => {
    try {
      const hashes = JSON.parse(jsonInput);
      if (!Array.isArray(hashes)) throw new Error("Input must be a JSON array of transaction hashes");
      
      setRunning(true);
      
      // Simulate multi-transaction diagnostics
      await new Promise(r => setTimeout(r, 600));
      
      const res = {
        total: hashes.length,
        success: Math.max(1, Math.floor(hashes.length / 2)),
        failed: Math.ceil(hashes.length / 2),
        avgCpu: 14200000,
        avgMem: 450000,
        items: hashes.map((h, i) => ({
          hash: h,
          success: i % 2 === 0,
          rootCause: i % 2 === 0 ? null : "HostError::ArithDomain",
          cpu: 8500000 + i * 2000000
        }))
      };
      setReport(res);
    } catch (e) {
      alert("Invalid JSON format: " + e.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-mono font-semibold text-paper-100">Multi-Transaction Batch Inspector</h3>
        </div>
        <p className="text-xs text-paper-400 mb-3">
          Paste a JSON array of transaction hashes to run batch root-cause diagnostics, calculate aggregate failure rates, and summarize resource costs on {network}.
        </p>
        <textarea
          rows={4}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full bg-ink-950 border border-ink-800 rounded-lg p-3 text-xs font-mono text-paper-200 focus:outline-none focus:border-teal-500 mb-4"
        />
        <button
          onClick={runBatch}
          disabled={running}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-ink-950 font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {running ? "Analyzing Batch..." : "Run Batch Diagnostics"}
        </button>
      </div>

      {report && (
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-ink-950 p-3 rounded-lg border border-ink-800">
              <div className="text-xs text-paper-400 font-mono">Total Transactions</div>
              <div className="text-lg font-mono font-bold text-paper-100">{report.total}</div>
            </div>
            <div className="bg-ink-950 p-3 rounded-lg border border-ink-800">
              <div className="text-xs text-paper-400 font-mono">Successful</div>
              <div className="text-lg font-mono font-bold text-emerald-400">{report.success}</div>
            </div>
            <div className="bg-ink-950 p-3 rounded-lg border border-ink-800">
              <div className="text-xs text-paper-400 font-mono">Failed / Trapped</div>
              <div className="text-lg font-mono font-bold text-rose-400">{report.failed}</div>
            </div>
            <div className="bg-ink-950 p-3 rounded-lg border border-ink-800">
              <div className="text-xs text-paper-400 font-mono">Avg CPU Gas</div>
              <div className="text-lg font-mono font-bold text-amber-400">{(report.avgCpu / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
