import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils.js";

function StatCard({ icon: Icon, label, value, subtext, accentClass }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accentClass ?? "bg-accent text-accent-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {subtext && <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
