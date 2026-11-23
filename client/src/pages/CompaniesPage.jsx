import { useEffect, useState } from "react";
import { Plus, Building2 } from "lucide-react";
import { toast } from "sonner";
import api from "../api/client.js";
import { getErrorMessage } from "../lib/errors.js";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import CompanyFormDialog from "../components/CompanyFormDialog.jsx";
import CompanyKanbanCard from "../components/CompanyKanbanCard.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_ORDER, STATUS_STYLES } from "@/lib/colors.js";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("WISHLIST");

  async function fetchCompanies() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/companies");
      setCompanies(res.data);
    } catch {
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  function openCreate(status) {
    setEditingCompany(null);
    setDefaultStatus(status || "WISHLIST");
    setDialogOpen(true);
  }

  function openEdit(company) {
    setEditingCompany(company);
    setDialogOpen(true);
  }

  async function handleSubmit(data) {
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany.id}`, data);
        toast.success("Company updated");
      } else {
        await api.post("/companies", data);
        toast.success("Company added");
      }
      await fetchCompanies();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save company"));
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      toast.success("Company deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete company"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Your target companies, organized by stage."
        action={
          <Button onClick={() => openCreate()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && !error && companies.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add the companies you're targeting to track your application pipeline."
          actionLabel="Add your first company"
          onAction={() => openCreate()}
        />
      )}

      {!loading && !error && companies.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {STATUS_ORDER.map((status) => {
            const style = STATUS_STYLES[status];
            const columnCompanies = companies.filter((c) => c.status === status);
            return (
              <div key={status} className="flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    <span className="text-sm font-semibold text-foreground">{style.label}</span>
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {columnCompanies.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => openCreate(status)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex-1 space-y-3 rounded-xl bg-muted/40 p-2 min-h-24">
                  {columnCompanies.length === 0 ? (
                    <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                      No companies
                    </p>
                  ) : (
                    columnCompanies.map((company) => (
                      <CompanyKanbanCard
                        key={company.id}
                        company={company}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editingCompany}
        defaultStatus={defaultStatus}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default CompaniesPage;
