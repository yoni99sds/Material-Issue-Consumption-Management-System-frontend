import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { materialService } from "../../services/material-service";
import { consumptionService } from "../../services/consumption-service";
import { userService } from "../../services/user-service";

import {
  BarChart3,
  Layers,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserPlus,
  Trash2,
  Users,
} from "lucide-react";

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
      <div className="mb-4">{icon}</div>
      <p className="text-zinc-500 text-sm">{label}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<any[]>([]);
  const [consumptions, setConsumptions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "operator",
  });

  const [totalIssues, setTotalIssues] = useState(0);
  const [pending, setPending] = useState(0);
  const [wastePercent, setWastePercent] = useState(0);
  const [efficiency, setEfficiency] = useState(0);

  const safe = (val: any) => (val && val.toString().trim() !== "" ? val : "-");

  const fetchData = async () => {
    try {
      const [issuesData, consumptionData, usersData] = await Promise.all([
        materialService.getAll(),
        consumptionService.getAll(),
        userService.getAll(),
      ]);

      setIssues(issuesData || []);
      setConsumptions(consumptionData || []);
      setUsers(usersData || []);

      setTotalIssues(issuesData?.length || 0);

      const pendingCount = (issuesData || []).filter(
        (i: any) => i?.header?.status === "pending"
      ).length;

      setPending(pendingCount);

      const totalIssued = (consumptionData || []).reduce(
        (sum: number, c: any) => sum + (c?.issuedQty || 0),
        0
      );

      const totalWaste = (consumptionData || []).reduce(
        (sum: number, c: any) => sum + (c?.wasteQty || 0),
        0
      );

      const waste = totalIssued ? (totalWaste / totalIssued) * 100 : 0;
      setWastePercent(waste);

      const totalReturned = (consumptionData || []).reduce(
        (sum: number, c: any) => sum + (c?.returnedQty || 0),
        0
      );

      const eff = totalIssued
        ? ((totalIssued - totalWaste - totalReturned) / totalIssued) * 100
        : 0;

      setEfficiency(eff);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) return;

    try {
      await userService.create(newUser);
      setNewUser({ username: "", password: "", role: "operator" });
      fetchData();
    } catch {
      alert("Failed to create user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold">
        Welcome back, {user?.username}
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Issues" value={totalIssues} icon={<Layers />} />
        <StatCard label="Waste %" value={wastePercent.toFixed(2) + "%"} icon={<TrendingDown />} />
        <StatCard label="Pending" value={pending} icon={<Clock />} />
        <StatCard label="Efficiency" value={efficiency.toFixed(2) + "%"} icon={<BarChart3 />} />
        <StatCard label="Users" value={users.length} icon={<Users />} />
      </div>

      {/* RECENT ISSUES */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="font-bold">Recent Material Issues</h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-zinc-500 text-sm">
              <th className="p-4">Order</th>
              <th>Machine</th>
              <th>Operator</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {issues.slice(0, 5).map((i: any) => (
              <tr key={i._id} className="text-sm border-t border-zinc-800">

                <td className="p-4">
                  {safe(i?.header?.workOrderNo)}
                </td>

                <td>
                  {safe(i?.header?.machine)}
                </td>

                <td>
                  {safe(i?.header?.operator)}
                </td>

                <td className="flex items-center gap-1">
                  {i?.header?.status === "approved" && <CheckCircle2 size={14} />}
                  {i?.header?.status === "pending" && <Clock size={14} />}
                  {i?.header?.status === "rejected" && <AlertCircle size={14} />}
                  {i?.header?.status || "pending"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USER MANAGEMENT */}
      {user?.role === "admin" && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">

          <h3 className="text-lg font-bold flex items-center gap-2">
            <UserPlus size={18} /> User Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded"
            />

            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded"
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded"
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={handleCreateUser}
              className="bg-purple-600 px-4 py-2 rounded"
            >
              Create User
            </button>
          </div>

          <div className="space-y-3">
            {users.map((u: any) => (
              <div
                key={u._id}
                className="flex justify-between p-4 border border-zinc-800 rounded-xl"
              >
                <div>
                  <p>{u.username}</p>
                  <p className="text-sm text-zinc-500">{u.role}</p>
                </div>

                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="text-red-400"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
