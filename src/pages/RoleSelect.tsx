import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ShieldCheck } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  const goToLogin = (role: "admin" | "entrepreneur") => {
    navigate("/login", { state: { selectedRole: role } });
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full bg-[#1a73e8] text-white">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold">Startup Keeper</p>
            <p className="text-xs opacity-90">Smart Startup Scheme Tracker</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Choose your role</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border border-border card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review student applications, monitor statuses, and manage the scheme portal.
              </p>
              <Button className="w-full" onClick={() => goToLogin("admin")}>
                Continue as Admin
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-border card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Entrepreneur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Discover Indian startup schemes and track your applications in one place.
              </p>
              <Button className="w-full" onClick={() => goToLogin("entrepreneur")}>
                Continue as Entrepreneur
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RoleSelect;
