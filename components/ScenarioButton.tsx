interface ScenarioButtonProps {
  id: string;
  title: string;
  description: string;
  logCount: number;
  service: string;
  loading: boolean;
  onClick: () => void;
}

export function ScenarioButton({
  title,
  description,
  logCount,
  service,
  loading,
  onClick,
}: ScenarioButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-left"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {logCount} logs • {service}
        </span>
        
        {loading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </div>
        ) : (
          <span className="text-blue-600 font-medium">Run →</span>
        )}
      </div>
    </button>
  );
}
