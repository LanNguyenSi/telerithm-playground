"use client";

import { useState } from "react";
import { ScenarioButton } from "@/components/ScenarioButton";
import { LogCounter } from "@/components/LogCounter";
import { CodeSnippet } from "@/components/CodeSnippet";
import { runFailedLogin, runSlowCheckout, runNormalTraffic } from "@/lib/scenarios";

export default function Home() {
  const [logCount, setLogCount] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScenario = async (scenarioId: string) => {
    setLoading(scenarioId);
    setError(null);
    
    try {
      let count = 0;
      
      switch (scenarioId) {
        case "failed-login":
          count = await runFailedLogin();
          break;
        case "slow-checkout":
          count = await runSlowCheckout();
          break;
        case "normal-traffic":
          count = await runNormalTraffic();
          break;
      }
      
      setLogCount(prev => prev + count);
    } catch (err: any) {
      setError(err.message || "Failed to send logs");
      console.error("Scenario error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            telerithm playground
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A realistic demo app with telerithm SDK integrated. Trigger scenarios and see logs flow in real-time.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Log Counter */}
        <LogCounter count={logCount} />

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ScenarioButton
            id="failed-login"
            title="Failed Login"
            description="User tries to log in, fails 3x, gets locked out"
            logCount={5}
            service="auth-service"
            loading={loading === "failed-login"}
            onClick={() => handleScenario("failed-login")}
          />
          
          <ScenarioButton
            id="slow-checkout"
            title="Slow Checkout"
            description="Payment API times out, retry, success"
            logCount={8}
            service="payment-service"
            loading={loading === "slow-checkout"}
            onClick={() => handleScenario("slow-checkout")}
          />
          
          <ScenarioButton
            id="normal-traffic"
            title="Normal Traffic"
            description="Background activity, healthy system"
            logCount={100}
            service="mixed"
            loading={loading === "normal-traffic"}
            onClick={() => handleScenario("normal-traffic")}
          />
        </div>

        {/* Code Snippet */}
        <CodeSnippet />

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://demo.telerithm.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            Open in Telerithm Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
