import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_STYLES } from "@/lib/colors.js";

function DifficultyBadge({ difficulty }) {
  const style = DIFFICULTY_STYLES[difficulty];
  return (
    <Badge variant="outline" className={`${style.bg} ${style.text} border-transparent`}>
      {difficulty}
    </Badge>
  );
}

export default DifficultyBadge;
