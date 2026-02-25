import { UserProfile } from "@/data/schemes";
import { useAuth } from "@/context/AuthContext";
import { Search, ClipboardCheck, BarChart3, Rocket, LayoutDashboard, Files, ListChecks, User, Shield } from "lucide-react";

type NavTab = "dashboard" | "schemes" | "applications" | "profile";

interface HeaderProps {
  profile: UserProfile;
  activeTab: NavTab;
  onTabChange?: (tab: NavTab) => void;
  onNavigate?: (section: "schemes" | "eligibility" | "tracker") => void;
}

const Header = ({ profile, activeTab, onTabChange, onNavigate }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="header-gradient px-6 py-6 text-primary-foreground">
      {/* Top navigation bar */}
      <div className="mx-auto max-w-7xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary-foreground flex items-center justify-center">
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">StartupSchemes</p>
            <p className="text-[11px] opacity-80">Smart Startup Scheme Tracker</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              onTabChange?.("dashboard");
              onNavigate?.("schemes");
            }}
            className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
              activeTab === "dashboard"
                ? "border-primary-foreground/90"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              onTabChange?.("schemes");
              onNavigate?.("schemes");
            }}
            className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
              activeTab === "schemes"
                ? "border-primary-foreground/90"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <Files className="h-3.5 w-3.5" />
            Schemes
          </button>
          <button
            type="button"
            onClick={() => {
              onTabChange?.("applications");
              onNavigate?.("tracker");
            }}
            className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
              activeTab === "applications"
                ? "border-primary-foreground/90"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <ListChecks className="h-3.5 w-3.5" />
            Applications
          </button>
          <a
            href="/profile"
            onClick={() => onTabChange?.("profile")}
            className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-primary-foreground/90"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Profile
          </a>
          {user?.role === "admin" && (
            <a
              href="/admin"
              className="inline-flex items-center gap-1 pb-1 border-b-2 border-transparent opacity-80 hover:opacity-100 transition"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin Panel
            </a>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-lg">
            {profile.name.charAt(0)}
          </div>
          <div className="text-right text-xs">
            <p className="font-semibold leading-tight truncate max-w-[170px]">
              Welcome, {profile.name.toUpperCase()}
            </p>
            <p className="opacity-80">
              {profile.businessType} | {profile.region} | {profile.startupStage}
            </p>
          </div>
        </div>
      </div>

      {/* Title + subtitle */}
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold tracking-tight">Startup Scheme Awareness Portal</h1>
        <p className="mt-1 text-sm opacity-90">Discover &amp; Apply for Government Startup Schemes</p>
      </div>

      {/* Quick Action Cards */}
      <div className="mx-auto max-w-7xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Search, title: "Find Schemes", desc: "Browse and filter government programs", section: "schemes" as const },
          { icon: ClipboardCheck, title: "Check Eligibility", desc: "Understand requirements & eligibility", section: "eligibility" as const },
          { icon: BarChart3, title: "Track Applications", desc: "Monitor your application status", section: "tracker" as const },
        ].map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onNavigate?.(item.section)}
            className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm px-4 py-3 text-left transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary/20 focus-visible:ring-primary"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs opacity-80">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
