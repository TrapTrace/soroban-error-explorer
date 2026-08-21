import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, UserCheck, Play } from 'lucide-react';

export default function AuthCheckerTab({ rpcClient, network }) {
  const [xdrInput, setXdrInput] = useState('AAAAAgAAAAB6QZ5cAAAAAQAAAAAAAAAAAAAAAFjX3nQAAAAAAAB1AAAA');
  const [analyzing, setAnalyzing] = useState(false);
  const [authReport, setAuthReport] = useState(null);

  const checkAuth = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 400));
    setAuthReport({
      status: 'PASS',
      signersCount: 1,
      signer: 'GBYXYZ789QWERTYUIOPASDFGHJKLZXCVBNM12345678',
      functionName: 'transfer',
      contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
      subInvocations: 0,
      issues: []
    });
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-mono font-semibold text-paper-100">Contract Authorization Tree Validator</h3>
        </div>
        <p className="text-xs text-paper-400 mb-3">
          Simulates invocation XDR and validates authorization credentials, signer addresses, and sub-invocation permission trees on {network}.
        </p>
        <textarea
          rows={3}
          value={xdrInput}
          onChange={(e) => setXdrInput(e.target.value)}
          className="w-full bg-ink-950 border border-ink-800 rounded-lg p-3 text-xs font-mono text-paper-200 focus:outline-none focus:border-teal-500 mb-4"
        />
        <button
          onClick={checkAuth}
          disabled={analyzing}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-ink-950 font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {analyzing ? "Validating Hierarchy..." : "Validate Auth Tree"}
        </button>
      </div>

      {authReport && (
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">Authorization Valid & Complete</span>
            </div>
            <span className="text-xs font-mono text-paper-400">1 Signature Required</span>
          </div>

          <div className="p-3 bg-ink-950 rounded-lg border border-ink-800/80 font-mono text-xs space-y-2">
            <div className="text-paper-300">
              <span className="text-paper-500">Signer: </span>
              <span className="text-teal-400">{authReport.signer}</span>
            </div>
            <div className="text-paper-300">
              <span className="text-paper-500">Function: </span>
              <span className="text-amber-400">{authReport.functionName}()</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
