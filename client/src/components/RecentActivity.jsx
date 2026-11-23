import DifficultyBadge from "./DifficultyBadge.jsx";
import { relativeTime } from "@/lib/relativeTime.js";

function RecentActivity({ problems }) {
  if (problems.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No activity yet — log your first problem to see it here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {problems.map((problem) => (
        <li key={problem.id} className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{problem.title}</p>
            <p className="text-xs text-muted-foreground">
              {problem.platform} · {problem.topic}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="w-14 text-right text-xs text-muted-foreground">
              {relativeTime(problem.date)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RecentActivity;
