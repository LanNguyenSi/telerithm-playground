"use client";

import { useState } from "react";

export function CodeSnippet() {
  const [copied, setCopied] = useState(false);

  const code = `import { TelerithmClient } from "@telerithm/sdk-js";

const t = new TelerithmClient({ 
  dsn: "https://key@demo.telerithm.cloud/source" 
});

// Log an error
t.error("Payment failed", { 
  userId: "u_123", 
  amount: 99.00 
});`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-lg shadow-lg p-6 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          SDK Integration Example
        </h3>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      <pre className="text-sm text-slate-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
