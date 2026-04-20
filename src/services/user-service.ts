import api from "../lib/api";

export const userService = {
  async getAll() {
    const res = await api.get("/users");
    return res.data;
  },

  async create(data: any) {
    const res = await api.post("/users", data);
    return res.data;
  },

  async delete(id: string) {
    await api.delete(`/users/${id}`);
  },
};