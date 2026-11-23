import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const STATUSES = ["SOLVED", "REVISIT"];

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const EMPTY = {
  title: "",
  platform: "",
  difficulty: "EASY",
  topic: "",
  status: "SOLVED",
  link: "",
  date: "",
  notes: "",
};

function ProblemFormDialog({ open, onOpenChange, initialValues, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialValues
          ? {
              title: initialValues.title || "",
              platform: initialValues.platform || "",
              difficulty: initialValues.difficulty || "EASY",
              topic: initialValues.topic || "",
              status: initialValues.status || "SOLVED",
              link: initialValues.link || "",
              date: toDateInputValue(initialValues.date),
              notes: initialValues.notes || "",
            }
          : EMPTY,
      );
      setFieldErrors({});
    }
  }, [open, initialValues]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.platform.trim()) errors.platform = "Platform is required.";
    if (!form.topic.trim()) errors.topic = "Topic is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title,
        platform: form.platform,
        difficulty: form.difficulty,
        topic: form.topic,
        status: form.status,
        link: form.link || undefined,
        notes: form.notes || undefined,
        ...(form.date ? { date: form.date } : {}),
      });
      onOpenChange(false);
    } catch {
      // surfaced via toast by the caller
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit Problem" : "Add Problem"}</DialogTitle>
          <DialogDescription>
            Track a coding problem you've solved or want to revisit.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              aria-invalid={!!fieldErrors.title}
            />
            {fieldErrors.title && <p className="text-xs text-destructive">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                placeholder="LeetCode, GFG..."
                value={form.platform}
                onChange={(e) => update("platform", e.target.value)}
                aria-invalid={!!fieldErrors.platform}
              />
              {fieldErrors.platform && (
                <p className="text-xs text-destructive">{fieldErrors.platform}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Arrays, DP..."
                value={form.topic}
                onChange={(e) => update("topic", e.target.value)}
                aria-invalid={!!fieldErrors.topic}
              />
              {fieldErrors.topic && <p className="text-xs text-destructive">{fieldErrors.topic}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                value={form.link}
                onChange={(e) => update("link", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProblemFormDialog;
