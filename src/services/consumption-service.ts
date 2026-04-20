import api from "../lib/api";
import { Consumption } from "../models/consumption";

export const consumptionService = {
  async getAll(): Promise<Consumption[]> {
    const response = await api.get<Consumption[]>("/consumption");
    return response.data;
  },

  async create(data: Omit<Consumption, "id">): Promise<Consumption> {
    const response = await api.post<Consumption>("/consumption", data);
    return response.data;
  },

  async update(id: string, data: Partial<Consumption>): Promise<Consumption> {
    const response = await api.put<Consumption>(`/consumption/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/consumption/${id}`);
  }
};