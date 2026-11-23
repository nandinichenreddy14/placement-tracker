import { useEffect, useMemo, useState } from "react";
import { Search, Plus, MoreHorizontal, ExternalLink, Code2 } from "lucide-react";
import { toast } from "sonner";
import api from "../api/client.js";
import { getErrorMessage } from "../lib/errors.js";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";
import ProblemStatusBadge from "../components/ProblemStatusBadge.jsx";
import ProblemFormDialog from "../components/ProblemFormDialog.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [topicFilter, setTopicFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  async function fetchProblems() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (difficultyFilter !== "ALL") params.difficulty = difficultyFilter;
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (topicFilter) params.topic = topicFilter;
      const res = await api.get("/problems", { params });
      setProblems(res.data);
    } catch {
      setError("Failed to load problems");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyFilter, statusFilter, topicFilter]);

  const visibleProblems = useMemo(() => {
    if (!search.trim()) return problems;
    const q = search.trim().toLowerCase();
    return problems.filter((p) => p.title.toLowerCase().includes(q));
  }, [problems, search]);

  const hasAnyData = problems.length > 0;
  const hasFiltersApplied =
    search.trim() || difficultyFilter !== "ALL" || statusFilter !== "ALL" || topicFilter;

  function openCreate() {
    setEditingProblem(null);
    setDialogOpen(true);
  }

  function openEdit(problem) {
    setEditingProblem(problem);
    setDialogOpen(true);
  }

  async function handleSubmit(data) {
    try {
      if (editingProblem) {
        await api.put(`/problems/${editingProblem.id}`, data);
        toast.success("Problem updated");
      } else {
        await api.post("/problems", data);
        toast.success("Problem added");
      }
      await fetchProblems();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save problem"));
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast.success("Problem deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete problem"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Problems"
        description="Everything you've solved or still need to revisit."
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Problem
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-8"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All difficulties</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="SOLVED">Solved</SelectItem>
            <SelectItem value="REVISIT">Revisit</SelectItem>
          </SelectContent>
        </Select>
        <Input
          className="h-9 w-[160px]"
          placeholder="Filter by topic"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && !error && !hasAnyData && (
        <EmptyState
          icon={Code2}
          title="No problems yet"
          description="Start tracking the coding problems you solve to see your progress here."
          actionLabel="Add your first problem"
          onAction={openCreate}
        />
      )}

      {!loading && !error && hasAnyData && visibleProblems.length === 0 && (
        <EmptyState
          icon={Search}
          title="No matching problems"
          description={
            hasFiltersApplied
              ? "Try adjusting your search or filters."
              : "No problems to show."
          }
        />
      )}

      {!loading && !error && visibleProblems.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      {problem.title}
                      {problem.link && (
                        <a
                          href={problem.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          aria-label={`Open ${problem.title} link`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{problem.platform}</TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{problem.topic}</TableCell>
                  <TableCell>
                    <ProblemStatusBadge status={problem.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(problem.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(problem)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(problem.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProblemFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editingProblem}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default ProblemsPage;
