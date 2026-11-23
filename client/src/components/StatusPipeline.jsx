import { ChevronRight } from "lucide-react";
import { STATUS_ORDER, STATUS_STYLES } from "@/lib/colors.js";

function StatusPipeline({ data }) {
  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: data.find((row) => row.status === status)?.count ?? 0,
  }));
  const total = counts.reduce((sum, row) => sum + row.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        No companies tracked yet.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap sm:gap-0">
      {counts.map(({ status, count }, index) => {
        const style = STATUS_STYLES[status];
        return (
          <div key={status} className="flex flex-1 items-center">
            <div className={`flex-1 rounded-xl border border-border px-3 py-3 text-center ${style.bg}`}>
              <p className={`text-xl font-bold ${style.text}`}>{count}</p>
              <p className="text-xs font-medium text-muted-foreground">{style.label}</p>
            </div>
            {index < counts.length - 1 && (
              <ChevronRight className="mx-1 hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StatusPipeline;
