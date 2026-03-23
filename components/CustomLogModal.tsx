"use client";

import { useState } from "react";
import { getTelerithmClient } from "@/lib/telerithm";

interface CustomLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSent: () => void;
}

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export function CustomLogModal({ isOpen, onClose, onLogSent }: CustomLogModalProps) {
  const [level, setLevel] = useState<"debug" | "info" | "warn" | "error">("error");
  const [service, setService] = useState("custom-app");
  const [message, setMessage] = useState("");
  const [host, setHost] = useState("play.telerithm.cloud");
  const [fields, setFields] = useState<KeyValuePair[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddField = () => {
    setFields([...fields, { id: Date.now().toString(), key: "", value: "" }]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleFieldChange = (id: string, field: "key" | "value", value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    setSending(true);
    setSuccess(false);

    try {
      const client = getTelerithmClient();
      
      const fieldsObject: Record<string, string> = {};
      fields.forEach((f) => {
        if (f.key.trim()) {
          fieldsObject[f.key] = f.value;
        }
      });

      await client.sendLogs([
        {
          level,
          service,
          message,
          fields: Object.keys(fieldsObject).length > 0 ? fieldsObject : undefined,
        },
      ]);

      setSuccess(true);
      onLogSent();
      
      // Reset message for next log
      setMessage("");
      setFields([]);
      
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to send log:", error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Send Custom Log</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="debug">debug</option>
              <option value="info">info</option>
              <option value="warn">warn</option>
              <option value="error">error</option>
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="custom-app"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Connection timeout to Stripe API"
              required
            />
          </div>

          {/* Host */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="play.telerithm.cloud"
            />
          </div>

          {/* Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fields (optional)
            </label>
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => handleFieldChange(field.id, "key", e.target.value)}
                    placeholder="key"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, "value", e.target.value)}
                    placeholder="value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    −
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add field
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              ✓ Log sent successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {sending ? "Sending..." : "Send Log"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
