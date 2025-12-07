import { useEffect, useState } from "react";

export default function EnvCheck() {
  const envInfo = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "NOT SET (falling back to localhost:8080)",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Environment Variables Check</h1>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h2 className="font-semibold text-gray-700">API Base URL</h2>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">{envInfo.apiUrl}</code>
              {envInfo.apiUrl?.includes("localhost") && <p className="text-red-600 text-sm mt-2">⚠️ WARNING: Using localhost! Environment variable not set in Vercel.</p>}
              {!envInfo.apiUrl?.includes("localhost") && <p className="text-green-600 text-sm mt-2">✅ Correct! Using production backend.</p>}
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h2 className="font-semibold text-gray-700">Node Environment</h2>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">{envInfo.nodeEnv}</code>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h2 className="font-semibold text-gray-700">Checked At</h2>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">{envInfo.timestamp}</code>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-800 mb-3">🚨 If you see &ldquo;localhost&rdquo; above:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-900">
              <li>
                Go to{" "}
                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                  Vercel Dashboard
                </a>
              </li>
              <li>Select your project → Settings → Environment Variables</li>
              <li>
                Add: <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_API_URL</code>
              </li>
              <li>
                Value: <code className="bg-yellow-100 px-1 rounded">https://task-tracker-new-2025.el.r.appspot.com</code>
              </li>
              <li>Apply to: Production, Preview, Development</li>
              <li>Save and Redeploy</li>
            </ol>
          </div>

          <div className="mt-6 flex gap-4">
            <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Go to Login
            </a>
            <a href="/dashboard" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
