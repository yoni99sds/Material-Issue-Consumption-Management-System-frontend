import { useEffect, useState } from "react";
import { materialService } from "../../services/material-service";
import { CheckCircle2, XCircle } from "lucide-react";

// 🔥 STRICT STATUS TYPE (FIX)
type Status = "pending" | "approved" | "rejected";

export default function SupervisorDashboard() {
  const [issues, setIssues] = useState<any[]>([]);

  const fetchIssues = async () => {
    try {
      const data = await materialService.getAll();
      setIssues(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // 🔥 FIXED TYPE HERE
  const updateStatus = async (id: string, status: Status) => {
    try {
      await materialService.update(id, {
        header: { status },
      });

      fetchIssues();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Supervisor Dashboard</h2>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
        <h3 className="mb-4 font-bold">Pending Approvals</h3>

        {issues
          .filter((i) => i.header?.status === "pending")
          .map((i) => (
            <div
              key={i._id}
              className="flex justify-between items-center border-b border-zinc-800 py-3"
            >
              <div>
                <p className="font-medium">{i.header?.workOrderNo}</p>
                <p className="text-sm text-zinc-500">
                  {i.header?.machine}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                {/* APPROVE */}
                <button
                  onClick={() => updateStatus(i._id, "approved")}
                  className="text-green-400 hover:text-green-300"
                >
                  <CheckCircle2 size={20} />
                </button>

                {/* REJECT */}
                <button
                  onClick={() => updateStatus(i._id, "rejected")}
                  className="text-red-400 hover:text-red-300"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}