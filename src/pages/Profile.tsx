import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Briefcase, MapPin, Rocket } from "lucide-react";

type NavTab = "dashboard" | "schemes" | "applications" | "profile";

const BUSINESS_TYPES = ["Tech", "Education", "Healthcare", "Agriculture", "Manufacturing", "Fintech", "Other"];

const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const STARTUP_STAGES = ["Idea", "Early Stage", "Growth"];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab] = useState<NavTab>("profile");
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [region, setRegion] = useState("Telangana");
  const [startupStage, setStartupStage] = useState(STARTUP_STAGES[1]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setStartupStage(user.startupStage ?? STARTUP_STAGES[1]);
    setBusinessType(user.businessType ?? BUSINESS_TYPES[0]);
    setRegion(user.region ?? "Telangana");
  }, [user]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      updateProfile({
        name,
        businessType,
        region,
        startupStage,
      });

      toast({
        title: "Profile updated",
        description: "Your profile details have been saved.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Please sign in to view your profile.
      </div>
    );
  }

  const profile = {
    name,
    businessType,
    region,
    startupStage,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} activeTab={activeTab} />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <Card className="card-shadow border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Name
                </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  Business Type
                </label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Region / State
                </label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES_AND_UTS.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                  <Rocket className="h-3.5 w-3.5 text-primary" />
                  Startup Stage
                </label>
                <Select value={startupStage} onValueChange={setStartupStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STARTUP_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 space-y-3">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                  }}
                >
                  Logout
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;

