import { useEffect, useState } from "react";
import { materialService } from "../../services/material-service";
import { consumptionService } from "../../services/consumption-service";
import { Layers, Clock } from "lucide-react";

export default function OperatorDashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await materialService.getAll();
        setIssues(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Operator Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-900 rounded-xl">
          <Layers /> Total Issues: {issues.length}
        </div>
        <div className="p-4 bg-zinc-900 rounded-xl">
          <Clock /> Pending:{" "}
          {issues.filter((i) => i.header?.status === "pending").length}
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
        <h3 className="mb-3 font-bold">Your Recent Entries</h3>
        {issues.slice(0, 5).map((i) => (
          <div key={i._id} className="border-b border-zinc-800 py-2">
            {i.header?.workOrderNo} - {i.header?.status}
          </div>
        ))}
      </div>
    </div>
  );
}