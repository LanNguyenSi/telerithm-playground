interface LogCounterProps {
  count: number;
}

export function LogCounter({ count }: LogCounterProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 text-center border-2 border-blue-100">
      <div className="text-6xl font-bold text-blue-600 mb-2 tabular-nums">
        {count.toLocaleString()}
      </div>
      <div className="text-lg text-slate-600">
        logs sent to Telerithm
      </div>
    </div>
  );
}
