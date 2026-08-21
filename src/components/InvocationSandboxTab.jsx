import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InvocationSandboxTab({ network }) {
  const [contractId, setContractId] = useState('CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC');
  const [fnName, setFnName] = useState('transfer');
  const [argsJson, setArgsJson] = useState('{\n  "from": "GBYXYZ1234567890",\n  "to": "GABC9876543210",\n  "amount": 1000\n}');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const simulateCall = async () => {
    setSimulating(true);
    await new Promise(r => setTimeout(r, 450));
    setSimResult({
      success: true,
      cpu: 4850000,
      mem: 125000,
      minFee: "150 stroops",
      events: ["transfer event emitted (from: GBY..., to: GAB..., amount: 1000)"]
    });
    setSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-mono font-semibold text-paper-100">Interactive Method Invocation Sandbox</h3>
        </div>
        <p className="text-xs text-paper-400 mb-3">
          Simulate parameterized contract calls in browser without submitting transactions on-chain.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Contract Address"
            className="bg-ink-950 border border-ink-800 rounded-lg p-2.5 text-xs font-mono text-paper-200 focus:outline-none focus:border-teal-500"
          />
          <input
            type="text"
            value={fnName}
            onChange={(e) => setFnName(e.target.value)}
            placeholder="Method Name"
            className="bg-ink-950 border border-ink-800 rounded-lg p-2.5 text-xs font-mono text-paper-200 focus:outline-none focus:border-teal-500"
          />
        </div>
        <textarea
          rows={4}
          value={argsJson}
          onChange={(e) => setArgsJson(e.target.value)}
          className="w-full bg-ink-950 border border-ink-800 rounded-lg p-3 text-xs font-mono text-paper-200 focus:outline-none focus:border-teal-500 mb-3"
        />
        <button
          onClick={simulateCall}
          disabled={simulating}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-ink-950 font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {simulating ? "Simulating Invocation..." : "Simulate Invocation"}
        </button>
      </div>

      {simResult && (
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Simulation Succeeded
          </div>
          <div className="grid grid-cols-3 gap-3 p-3 bg-ink-950 rounded-lg border border-ink-800">
            <div><span className="text-paper-500">CPU Gas:</span> <span className="text-paper-200 font-bold">{(simResult.cpu).toLocaleString()}</span></div>
            <div><span className="text-paper-500">RAM:</span> <span className="text-paper-200 font-bold">{(simResult.mem / 1024).toFixed(1)} KB</span></div>
            <div><span className="text-paper-500">Min Fee:</span> <span className="text-paper-200 font-bold">{simResult.minFee}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
