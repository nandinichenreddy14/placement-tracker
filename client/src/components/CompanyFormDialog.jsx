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
import { STATUS_ORDER, STATUS_STYLES } from "@/lib/colors.js";

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const EMPTY = {
  name: "",
  role: "",
  status: "WISHLIST",
  interviewDate: "",
  notes: "",
};

function CompanyFormDialog({ open, onOpenChange, initialValues, defaultStatus, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialValues
          ? {
              name: initialValues.name || "",
              role: initialValues.role || "",
              status: initialValues.status || "WISHLIST",
              interviewDate: toDateInputValue(initialValues.interviewDate),
              notes: initialValues.notes || "",
            }
          : { ...EMPTY, status: defaultStatus || "WISHLIST" },
      );
      setFieldErrors({});
    }
  }, [open, initialValues, defaultStatus]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Company name is required.";
    if (!form.role.trim()) errors.role = "Role is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name,
        role: form.role,
        status: form.status,
        interviewDate: form.interviewDate || null,
        notes: form.notes || undefined,
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
          <DialogTitle>{initialValues ? "Edit Company" : "Add Company"}</DialogTitle>
          <DialogDescription>Track a company you're targeting or interviewing with.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Company name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                aria-invalid={!!fieldErrors.role}
              />
              {fieldErrors.role && <p className="text-xs text-destructive">{fieldErrors.role}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_STYLES[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewDate">Interview date</Label>
            <Input
              id="interviewDate"
              type="date"
              value={form.interviewDate}
              onChange={(e) => update("interviewDate", e.target.value)}
            />
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

export default CompanyFormDialog;
