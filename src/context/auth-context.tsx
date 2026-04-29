import { createContext, useContext, useState } from "react";

interface AuthUser {
  _id: string;
  username: string;
  role: "admin" | "operator" | "supervisor";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ LOGIN (memory only)
  const login = (userData: AuthUser, jwt: string) => {
    setUser(userData);
    setToken(jwt);
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
