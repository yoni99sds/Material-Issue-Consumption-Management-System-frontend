import { useEffect, useState } from "react";
import { materialService } from "../../services/material-service";
import { CheckCircle2, Clock } from "lucide-react";

export default function SupervisorDashboard() {
  const [issues, setIssues] = useState<any[]>([]);

  const fetch = async () => {
    const data = await materialService.getAll();
    setIssues(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await materialService.update(id, {
      header: { status },
    });
    fetch();
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
                <p>{i.header?.workOrderNo}</p>
                <p className="text-sm text-zinc-500">
                  {i.header?.machine}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(i._id, "approved")}
                  className="text-green-400"
                >
                  <CheckCircle2 />
                </button>

                <button
                  onClick={() => updateStatus(i._id, "rejected")}
                  className="text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}