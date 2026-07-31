export function ProgressSteps({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="mx-auto flex max-w-lg items-center justify-between gap-2">
      {steps.map((label, index) => {
        const active = index <= current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              {index > 0 ? (
                <div
                  className={`h-px flex-1 ${active ? "bg-ink" : "bg-border"}`}
                />
              ) : (
                <div className="flex-1" />
              )}
              <span
                className={`mx-1 flex h-3 w-3 rounded-full border ${
                  active ? "border-ink bg-ink" : "border-border bg-transparent"
                }`}
                aria-current={index === current ? "step" : undefined}
              />
              {index < steps.length - 1 ? (
                <div
                  className={`h-px flex-1 ${
                    index < current ? "bg-ink" : "bg-border"
                  }`}
                />
              ) : (
                <div className="flex-1" />
              )}
            </div>
            <span
              className={`text-xs ${
                index === current ? "text-ink" : "text-ink-soft"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
