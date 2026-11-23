import { Badge } from "@/components/ui/badge";

function ProblemStatusBadge({ status }) {
  const isSolved = status === "SOLVED";
  return (
    <Badge
      variant="outline"
      className={
        isSolved
          ? "bg-easy-soft text-easy border-transparent"
          : "bg-medium-soft text-medium border-transparent"
      }
    >
      {isSolved ? "Solved" : "Revisit"}
    </Badge>
  );
}

export default ProblemStatusBadge;
