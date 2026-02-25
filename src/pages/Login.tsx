import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Rocket, ShieldCheck, LogIn, Mail, Lock, Chrome } from "lucide-react";

const Login = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirect = () => {
    const from = (location.state?.from as any)?.pathname || "/";
    navigate(from, { replace: true });
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      handleRedirect();
    } catch (err) {
      console.error(err);
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      handleRedirect();
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Badge variant="outline" className="gap-2 w-fit">
            <ShieldCheck className="h-4 w-4 text-success" />
            Secure Startup Portal
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Startup Keeper</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your applications for real Indian startup schemes like SISFS, MeitY SAMRIDH, T-Fund, and PRISM – all in one place.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Track your scheme applications in real time with a live status dashboard.</p>
            </div>
          </div>
        </div>

        <Card className="border border-border card-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogIn className="h-4 w-4" />
              Sign in to your workspace
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Use email or continue with Google. You can plug in Firebase or Supabase later without changing this UI.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3 text-primary" />
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.in"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3 text-primary" />
                  Password
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in with Email"}
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">or</span>
              <Separator className="flex-1" />
            </div>

            <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={loading}>
              <Chrome className="h-4 w-4 text-primary" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

