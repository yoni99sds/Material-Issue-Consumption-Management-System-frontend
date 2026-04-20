export interface User {
  id: string | null;
  username: string;
  role: "admin" | "operator" | "supervisor";
  token: string | null;
}