import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES } from "@/lib/colors.js";

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge variant="outline" className={`${style.bg} ${style.text} border-transparent`}>
      {style.label}
    </Badge>
  );
}

export default StatusBadge;
