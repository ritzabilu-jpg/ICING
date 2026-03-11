interface StepIndicatorProps {
  current: 1 | 2 | 3;
  labels: [string, string, string];
}

export default function StepIndicator({ current, labels }: StepIndicatorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-0 relative max-w-lg mx-auto">
        {([1, 2, 3] as const).map((step, i) => (
          <div key={step} className="flex items-center flex-1 justify-center">
            {/* Connector line before (except first) */}
            {i > 0 && (
              <div className={`flex-1 h-0.5 transition-colors duration-300 -ms-2 -me-2
                               ${current > step - 1 ? 'bg-ice-500' : 'bg-slate-200'}`} />
            )}

            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5 z-10 px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm
                             transition-all duration-300
                             ${current === step
                               ? 'bg-ice-500 text-white shadow-lg shadow-ice-500/30 scale-110'
                               : current > step
                                 ? 'bg-ice-500/20 text-ice-600'
                                 : 'bg-slate-100 text-slate-400'
                             }`}
              >
                {current > step ? '✓' : step}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap
                             ${current === step ? 'text-navy-900' : 'text-slate-400'}`}
              >
                {labels[i]}
              </span>
            </div>

            {/* Connector line after (except last) */}
            {i < 2 && (
              <div className={`flex-1 h-0.5 transition-colors duration-300 -ms-2 -me-2
                               ${current > step ? 'bg-ice-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
