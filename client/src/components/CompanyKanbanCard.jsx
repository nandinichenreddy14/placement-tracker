import { CalendarDays, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function CompanyKanbanCard({ company, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Card className="shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-foreground">{company.name}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-1.5 -mt-1 h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(company)}>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => onDelete(company.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground">{company.role}</p>
          {company.interviewDate && (
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(company.interviewDate).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CompanyKanbanCard;
