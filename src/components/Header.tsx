import { UserProfile } from "@/data/schemes";
import { Search, ClipboardCheck, BarChart3 } from "lucide-react";

interface HeaderProps {
  profile: UserProfile;
}

const Header = ({ profile }: HeaderProps) => {
  return (
    <header className="header-gradient px-6 py-6 text-primary-foreground">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Startup Scheme Awareness Portal</h1>
          <p className="mt-1 text-sm opacity-90">Discover & Apply for Government Startup Schemes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-lg">
            {profile.name.charAt(0)}
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">Welcome, {profile.name}</p>
            <p className="text-xs opacity-80">{profile.businessType} Startup | {profile.region} | {profile.startupStage}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="mx-auto max-w-7xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Search, title: "Find Schemes", desc: "Browse and filter government programs" },
          { icon: ClipboardCheck, title: "Check Eligibility", desc: "Understand requirements & eligibility" },
          { icon: BarChart3, title: "Track Applications", desc: "Monitor your application status" },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs opacity-80">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
