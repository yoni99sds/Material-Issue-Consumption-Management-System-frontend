import api from "../lib/api";

export const materialService = {
  getAll: async () => {
    const res = await api.get("/material-issue");
    return res.data || [];
  },

  create: async (data: any) => {
    const res = await api.post("/material-issue", data);
    return res.data;
  },

  update: async (id: string, status: string) => {
    const res = await api.put(`/material-issue/${id}`, { status });
    return res.data;
  },

  delete: async (id: string) => {
    return api.delete(`/material-issue/${id}`);
  },
};
