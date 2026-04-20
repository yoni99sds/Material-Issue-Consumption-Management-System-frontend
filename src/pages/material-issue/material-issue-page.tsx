import { useState, useEffect } from "react";
import { MaterialIssueHeader, MaterialIssueRow } from "../../models/material";
import { materialService } from "../../services/material-service";
import { toast } from "sonner";
import { Plus, Trash2, Send, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";

export default function MaterialIssuePage() {
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [header, setHeader] = useState<MaterialIssueHeader>({
    id: null,
    date: new Date().toISOString().split("T")[0],
    machine: "",
    workOrderNo: "",
    jobDescription: null,
    shift: "Day",
    operator: user?.username || "",
    status: "pending",
  });

  const [rows, setRows] = useState<MaterialIssueRow[]>([]);
  const [newRow, setNewRow] = useState<MaterialIssueRow>({
    sn: 0,
    description: "",
    rollNo: "",
    width: 0,
    weight: 0,
    issuedLength: 0,
    waste: 0,
    actualSheetProduced: 1,
    sheetSize: "",
  });

  // ✅ Fetch issues
  const fetchIssues = async () => {
    try {
      const data = await materialService.getAll();
      setIssues(data);
    } catch {
      toast.error("Failed to load issues");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // ✅ Add Row
  const handleAddRow = () => {
    if (!newRow.description || !newRow.rollNo) {
      toast.error("Description and Roll No are required");
      return;
    }

    if (rows.some((r) => r.rollNo === newRow.rollNo)) {
      toast.error("Roll No must be unique");
      return;
    }

    setRows([...rows, { ...newRow, sn: rows.length + 1 }]);

    setNewRow({
      sn: 0,
      description: "",
      rollNo: "",
      width: 0,
      weight: 0,
      issuedLength: 0,
      waste: 0,
      actualSheetProduced: 1,
      sheetSize: "",
    });
  };

  const removeRow = (sn: number) => {
    setRows(rows.filter((r) => r.sn !== sn));
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (rows.length === 0) {
      toast.error("Add at least one row");
      return;
    }

    setIsSubmitting(true);
    try {
      await materialService.create({ header, rows });

      toast.success("Submitted successfully");

      setRows([]);

      setHeader({
        id: null,
        date: new Date().toISOString().split("T")[0],
        machine: "",
        workOrderNo: "",
        jobDescription: null,
        shift: "Day",
        operator: user?.username || "",
        status: "pending",
      });

      fetchIssues();
    } catch {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    try {
      await materialService.delete(id);
      toast.success("Deleted");
      fetchIssues();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ Approve / Reject
  const updateStatus = async (status: "approved" | "rejected") => {
    if (!selectedId) return;

    try {
      await materialService.update(selectedId, {
        header: { status },
      });

      toast.success(`Marked as ${status}`);
      fetchIssues();
    } catch {
      toast.error("Update failed");
    }
  };

  const isSupervisor = user?.role === "supervisor" || user?.role === "admin";

  return (
    <div className="space-y-8 pb-12">

      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-white">Material Issue</h2>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
          Submit
        </Button>
      </div>

      {/* HEADER FORM */}
      <Card>
        <CardContent className="grid grid-cols-3 gap-4">
          <Input
            placeholder="Machine"
            value={header.machine}
            onChange={(e) => setHeader({ ...header, machine: e.target.value })}
          />
          <Input
            placeholder="Work Order"
            value={header.workOrderNo}
            onChange={(e) =>
              setHeader({ ...header, workOrderNo: e.target.value })
            }
          />
        </CardContent>
      </Card>

      {/* ROW INPUT */}
      <Card>
        <CardContent className="grid grid-cols-6 gap-4">
          <Input
            placeholder="Description"
            value={newRow.description}
            onChange={(e) =>
              setNewRow({ ...newRow, description: e.target.value })
            }
          />
          <Input
            placeholder="Roll No"
            value={newRow.rollNo}
            onChange={(e) =>
              setNewRow({ ...newRow, rollNo: e.target.value })
            }
          />
          <Button onClick={handleAddRow}>
            <Plus />
          </Button>
        </CardContent>
      </Card>

      {/* ROW TABLE */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SN</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.sn}>
                  <TableCell>{row.sn}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.rollNo}</TableCell>
                  <TableCell>
                    <Button onClick={() => removeRow(row.sn)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ISSUES LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Submitted Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => setSelectedId(issue._id)}
              className={`p-3 border cursor-pointer ${
                selectedId === issue._id ? "border-purple-500" : "border-zinc-700"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p>{issue.header.workOrderNo}</p>
                  <p className="text-sm text-zinc-400">
                    {issue.header.machine}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span>{issue.header.status}</span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(issue._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SUPERVISOR */}
      {isSupervisor && (
        <div className="flex gap-4">
          <Button onClick={() => updateStatus("approved")}>
            <CheckCircle /> Approve
          </Button>
          <Button onClick={() => updateStatus("rejected")}>
            <Trash2 /> Reject
          </Button>
        </div>
      )}
    </div>
  );
}