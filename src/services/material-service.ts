import api from "../lib/api";
import { MaterialIssueHeader, MaterialIssueRow } from "../models/material";

export interface MaterialIssuePayload {
  header: MaterialIssueHeader;
  rows: MaterialIssueRow[];
}

// ✅ NEW TYPE FOR UPDATE
export interface UpdateMaterialIssuePayload {
  header?: Partial<MaterialIssueHeader>;
  rows?: MaterialIssueRow[];
}

export const materialService = {
  async getAll() {
    const response = await api.get("/material-issue");
    return response.data;
  },

  async create(data: MaterialIssuePayload) {
    const response = await api.post("/material-issue", data);
    return response.data;
  },

  // ✅ FIXED UPDATE
  async update(id: string, data: UpdateMaterialIssuePayload) {
    const response = await api.put(`/material-issue/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/material-issue/${id}`);
  },
};