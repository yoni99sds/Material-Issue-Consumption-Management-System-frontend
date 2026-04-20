import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth-service";
import { useAuth } from "../../context/auth-context";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { LogIn, Lock, User as UserIcon, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(username, password);

      // 🔥 VERY IMPORTANT
      if (!response?.user || !response?.token) {
        throw new Error("Invalid response from server");
      }

      const { user, token } = response;

      // ✅ store auth
      login(user, token);

      toast.success(`Welcome back, ${user.username}!`);

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-zinc-800 mb-4">
            <img
              src="favicon.png"
              alt="Logo"
              className="w-12 h-12 object-cover rounded-lg"
            />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">
            Material Issue & Consumption System
          </h1>

          <p className="text-zinc-500 mt-2">
            Sign in to manage your workflow
          </p>
        </div>

        {/* CARD */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">Login</CardTitle>
            <CardDescription className="text-zinc-500">
              Enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* USERNAME */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 ml-1">
                  Username
                </label>

                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    size={18}
                  />

                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-black border-zinc-800 text-white"
                    placeholder="Username"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 ml-1">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    size={18}
                  />

                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black border-zinc-800 text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 h-12 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <LogIn size={20} />
                )}
                <span className="ml-2">
                  {isLoading ? "Signing in..." : "Sign In"}
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}