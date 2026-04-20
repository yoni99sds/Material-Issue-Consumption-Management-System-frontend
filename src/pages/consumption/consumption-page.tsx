import { useState, useEffect } from "react";
import { Consumption } from "../../models/consumption";
import { consumptionService } from "../../services/consumption-service";
import { toast } from "sonner";
import { Calculator, Save, History, Trash2, Loader2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";

export default function ConsumptionPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [history, setHistory] = useState<Consumption[]>([]);

  const [data, setData] = useState<Omit<Consumption, "id">>({
    itemCode: "",
    description: "",
    UOM: "KG",
    issuedQty: 0,
    returnedQty: 0,
    wasteQty: 0,
    remark: null,
    date: new Date().toISOString().split("T")[0]
  });

  // ✅ Fetch from API only
  const fetchHistory = async () => {
    setFetching(true);
    try {
      const records = await consumptionService.getAll();
      setHistory(records);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const netConsumption = data.issuedQty - data.returnedQty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.itemCode) return toast.error("Item Code is required");
    if (data.issuedQty <= 0) return toast.error("Issued Quantity must be greater than 0");
    if (data.returnedQty < 0 || data.wasteQty < 0) return toast.error("Quantities cannot be negative");
    if (data.returnedQty + data.wasteQty > data.issuedQty) {
      return toast.error("Returned + Waste cannot exceed Issed Quantity");
    }

    setLoading(true);
    try {
      await consumptionService.create(data);
      toast.success("Saved successfully");

      // reset form
      setData({
        itemCode: "",
        description: "",
        UOM: "KG",
        issuedQty: 0,
        returnedQty: 0,
        wasteQty: 0,
        remark: null,
        date: new Date().toISOString().split("T")[0]
      });

      fetchHistory();
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | null) => {
    if (!id) return;

    try {
      await consumptionService.delete(id);
      toast.success("Deleted");
      fetchHistory();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <h2 className="text-3xl font-bold text-white">Material Consumption</h2>

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Item Code"
              value={data.itemCode}
              onChange={(e) => setData({ ...data, itemCode: e.target.value })}
            />

            <Input
              type="number"
              placeholder="Issued"
              value={data.issuedQty}
              onChange={(e) => setData({ ...data, issuedQty: Number(e.target.value) })}
            />

            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="text-center py-6 text-zinc-400">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.itemCode}</TableCell>
                    <TableCell>{r.issuedQty}</TableCell>
                    <TableCell>{r.issuedQty - r.returnedQty}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(r.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}