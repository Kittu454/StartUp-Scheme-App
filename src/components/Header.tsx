import { UserProfile } from "@/data/schemes";
import { useAuth } from "@/context/AuthContext";
import { Search, ClipboardCheck, BarChart3, Rocket, LayoutDashboard, Files, ListChecks, User, Shield, LogOut } from "lucide-react";

type NavTab = "dashboard" | "schemes" | "applications" | "profile";

interface HeaderProps {
  profile: UserProfile;
  activeTab: NavTab;
  onTabChange?: (tab: NavTab) => void;
  onNavigate?: (section: "schemes" | "eligibility" | "tracker") => void;
}

const Header = ({ profile, activeTab, onTabChange, onNavigate }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="px-6 py-6 bg-[#003366] text-white">
      {/* Top navigation bar */}
      <div className="mx-auto max-w-7xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-white/15 flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Startup Keeper</p>
            <p className="text-[11px] opacity-80">GovTech Awareness Portal</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          {user?.role === "admin" ? (
            <>
              <a href="/admin" className="inline-flex items-center gap-1 pb-1 border-b-2 border-transparent opacity-80 hover:opacity-100 transition">
                <Shield className="h-3.5 w-3.5" />
                Admin Panel
              </a>
              <a
                href="/profile"
                onClick={() => onTabChange?.("profile")}
                className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
                  activeTab === "profile" ? "border-white/90" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </a>
            </>
          ) : (
            <>
              <a
                href="/dashboard"
                onClick={() => onTabChange?.("dashboard")}
                className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
                  activeTab === "dashboard" ? "border-white/90" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </a>
              <a
                href="/schemes"
                onClick={() => onTabChange?.("schemes")}
                className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
                  activeTab === "schemes" ? "border-white/90" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Files className="h-3.5 w-3.5" />
                Schemes
              </a>
              <a
                href="/dashboard"
                onClick={() => onTabChange?.("applications")}
                className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
                  activeTab === "applications" ? "border-white/90" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <ListChecks className="h-3.5 w-3.5" />
                Applications
              </a>
              <a
                href="/profile"
                onClick={() => onTabChange?.("profile")}
                className={`inline-flex items-center gap-1 pb-1 border-b-2 transition-all ${
                  activeTab === "profile" ? "border-white/90" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </a>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <a href="/profile" className="inline-flex items-center gap-1 text-sm hover:opacity-90">
            <User className="h-4 w-4" />
            Profile
          </a>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/start";
            }}
            className="inline-flex items-center gap-1 text-sm hover:opacity-90"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Title + subtitle */}
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold tracking-tight">Startup Scheme Awareness Portal</h1>
        <p className="mt-1 text-sm opacity-90">Discover &amp; Apply for Government Startup Schemes</p>
      </div>

      {/* Quick Action Cards */}
      {user?.role !== "admin" && (
      <div className="mx-auto max-w-7xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Search, title: "Find Schemes", desc: "Browse and filter government programs", section: "schemes" as const },
          { icon: ClipboardCheck, title: "Check Eligibility", desc: "Understand requirements & eligibility", section: "eligibility" as const },
          { icon: BarChart3, title: "Track Applications", desc: "Monitor your application status", section: "tracker" as const },
        ].map((item) => (
          item.title === "Find Schemes" ? (
            <a
              key={item.title}
              href="/schemes"
              className="flex items-center gap-3 rounded-md bg-white/10 px-4 py-3 text-left transition hover:bg-white/15 focus-visible:outline-none"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/20">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs opacity-80">{item.desc}</p>
              </div>
            </a>
          ) : (
            <button
              key={item.title}
              type="button"
              onClick={() => onNavigate?.(item.section)}
              className="flex items-center gap-3 rounded-md bg-white/10 px-4 py-3 text-left transition hover:bg-white/15 focus-visible:outline-none"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/20">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs opacity-80">{item.desc}</p>
              </div>
            </button>
          )
        ))}
      </div>
      )}
    </header>
  );
};

export default Header;
