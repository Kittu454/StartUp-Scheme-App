import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Rocket, ShieldCheck, LogIn, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const { loginWithOtp, updateProfile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { selectedRole?: UserRole } };

  const [tab, setTab] = useState<"email" | "phone">("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [otpPhase, setOtpPhase] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const selectedRole: UserRole = location.state?.selectedRole ?? "student";

  useEffect(() => {
    if (!otpPhase) return;
    setCountdown(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpPhase]);

  const handleGenerate = async () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setOtpPhase(true);
      const target = tab === "email" ? email : `+91 ${phone}`;
      toast.success(`Success: OTP sent to ${target}`);
    }, 1200);
  };

  const verifyOtp = async () => {
    if (otp !== "123456") {
      toast.error("Invalid OTP. Try again.");
      return;
    }
    const identifier = tab === "email" ? email : `+91 ${phone}`;
    await loginWithOtp(identifier, selectedRole);
    updateProfile({
      name: fullName,
      businessType: user?.businessType ?? "Tech",
      region: user?.region ?? "Telangana",
      startupStage: user?.startupStage ?? "Early Stage",
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="mx-auto max-w-5xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <Badge variant="outline" className="gap-2 w-fit">
            <ShieldCheck className="h-4 w-4 text-success" />
            Secure Startup Portal
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Startup Keeper</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your applications for Indian startup schemes like SISFS, MeitY SAMRIDH, T-Fund, and PRISM.
          </p>
        </div>

        <Card className="border border-border card-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogIn className="h-4 w-4" />
              Sign in to your workspace
            </CardTitle>
            <p className="text-xs text-muted-foreground">Use Email or Phone to receive OTP</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Krishna Reddy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={otpPhase}
                  className="pl-9"
                />
              </div>
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "email" | "phone")}>
              <TabsList className="w-full">
                <TabsTrigger value="email" className="flex-1">Email Login</TabsTrigger>
                <TabsTrigger value="phone" className="flex-1">Phone Login</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="mt-4 space-y-3">
                <label className="text-xs font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3 text-primary" />
                  Email address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.in"
                  disabled={otpPhase}
                />
              </TabsContent>
              <TabsContent value="phone" className="mt-4 space-y-3">
                <label className="text-xs font-medium flex items-center gap-1">
                  <Phone className="h-3 w-3 text-primary" />
                  Phone number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-input bg-muted text-sm text-muted-foreground select-none">
                    +91
                  </span>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="rounded-l-none"
                    disabled={otpPhase}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {!otpPhase ? (
              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={
                  generating ||
                  !fullName ||
                  (tab === "email" ? !email : !phone)
                }
              >
                {generating ? `Sending OTP to ${fullName}...` : "Generate OTP"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Hello {fullName}, please enter the 6-digit code sent to your device.
                  </p>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button className="w-full" onClick={verifyOtp}>Verify & Continue</Button>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Resend OTP in {countdown}s</span>
                  <Button type="button" variant="link" className="px-0" disabled={!canResend} onClick={handleGenerate}>
                    Resend OTP
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

