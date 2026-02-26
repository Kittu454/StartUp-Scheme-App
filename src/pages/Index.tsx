import { useState, useMemo, useRef, useEffect } from "react";
import Header from "@/components/Header";
import SchemeFilters from "@/components/SchemeFilters";
import SchemeCard from "@/components/SchemeCard";
import SchemeDetailDialog from "@/components/SchemeDetailDialog";
import EligibilitySection from "@/components/EligibilitySection";
import ApplicationTracker from "@/components/ApplicationTracker";
import DashboardSummary from "@/components/DashboardSummary";
import SavedSchemes from "@/components/SavedSchemes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  schemesData,
  initialApplications,
  Scheme,
  Application,
  ApplicationStatus,
} from "@/data/schemes";
import { useAuth } from "@/context/AuthContext";

type NavTab = "dashboard" | "schemes" | "applications" | "profile";

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [regionFilter, setRegionFilter] = useState("All");
  const [businessFilter, setBusinessFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [appliedFilters, setAppliedFilters] = useState({ region: "All", business: "All", stage: "All" });
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window === "undefined" || !initialApplications.length) return initialApplications;
    if (!user) return initialApplications;
    try {
      const raw = window.localStorage.getItem(`startup-keeper-apps-${user.id}`);
      if (!raw) return initialApplications;
      return JSON.parse(raw) as Application[];
    } catch {
      return initialApplications;
    }
  });
  const [lastViewedScheme, setLastViewedScheme] = useState<Scheme | null>(null);

  const schemesRef = useRef<HTMLDivElement | null>(null);
  const eligibilityRef = useRef<HTMLDivElement | null>(null);
  const trackerRef = useRef<HTMLDivElement | null>(null);
  const savedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;
    try {
      window.localStorage.setItem(`startup-keeper-apps-${user.id}`, JSON.stringify(applications));
    } catch {
      // ignore persistence errors
    }
  }, [user, applications]);

  const filteredSchemes = useMemo(() => {
    return schemesData.filter((s) => {
      if (appliedFilters.region !== "All" && s.region !== appliedFilters.region && s.region !== "Central") return false;
      if (appliedFilters.business !== "All" && s.businessType !== appliedFilters.business) return false;
      if (appliedFilters.stage !== "All" && s.requiredStage !== appliedFilters.stage) return false;
      return true;
    });
  }, [appliedFilters]);

  const governmentSchemes = useMemo(
    () => filteredSchemes.filter((s) => s.sourceType === "Government"),
    [filteredSchemes],
  );

  const privateSchemes = useMemo(
    () => filteredSchemes.filter((s) => s.sourceType === "Private"),
    [filteredSchemes],
  );

  const profileCompletion =
    ["name", "businessType", "region", "startupStage"].reduce((acc, key) => {
      const val = (user as any)?.[key];
      return acc + (val ? 1 : 0);
    }, 0) / 4;

  const eligibilityBuckets = useMemo(() => {
    const likely = filteredSchemes.filter(s =>
      (s.region === "Central" || s.region === (user?.region ?? "Telangana")) &&
      (s.businessType === (user?.businessType ?? "Tech") || s.businessType === "All") &&
      s.requiredStage === (user?.startupStage ?? "Early Stage")
    ).length;
    const possibly = filteredSchemes.filter(s => {
      const regionOk = s.region === "Central" || s.region === (user?.region ?? "Telangana");
      const btOk = s.businessType === (user?.businessType ?? "Tech") || s.businessType === "All";
      const stageOk = s.requiredStage === (user?.startupStage ?? "Early Stage");
      return (regionOk && btOk && !stageOk) || (regionOk && !btOk && stageOk) || (!regionOk && btOk && stageOk);
    }).length;
    const notEligible = Math.max(filteredSchemes.length - likely - possibly, 0);
    return { likely, possibly, notEligible };
  }, [filteredSchemes, user]);

  const totalApplications = applications.filter(a => a.status !== "Not Applied").length;
  const successRate =
    totalApplications === 0 ? 0 :
    Math.round((applications.filter(a => a.status === "Approved").length / totalApplications) * 100);
  const handleApplyFilters = () => {
    setAppliedFilters({ region: regionFilter, business: businessFilter, stage: stageFilter });
  };

  const handleViewDetails = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setLastViewedScheme(scheme);
    setDialogOpen(true);
  };

  const handleMarkInterested = (schemeId: string) => {
    setApplications(prev => {
      const existing = prev.find(a => a.schemeId === schemeId);
      if (existing) {
        return prev.map(a => a.schemeId === schemeId ? { ...a, interested: !a.interested } : a);
      }
      return [...prev, { schemeId, status: "Not Applied" as ApplicationStatus, date: "", interested: true }];
    });
  };

  const handleStatusChange = (schemeId: string, status: ApplicationStatus) => {
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    setApplications(prev =>
      prev.map(a => a.schemeId === schemeId ? { ...a, status, date: status !== "Not Applied" ? today : "" } : a)
    );
  };

  const isInterested = (schemeId: string) => applications.some(a => a.schemeId === schemeId && a.interested);

  const handleNavigateSection = (section: "schemes" | "eligibility" | "tracker") => {
    const map = {
      schemes: schemesRef,
      eligibility: eligibilityRef,
      tracker: trackerRef,
    } as const;
    const targetRef = map[section];
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const profile = {
    name: user?.name ?? "Krishna",
    businessType: user?.businessType ?? "Tech",
    region: user?.region ?? "Telangana",
    startupStage: user?.startupStage ?? "Early Stage",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigate={handleNavigateSection}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        {/* Dashboard Summary */}
        <DashboardSummary applications={applications} />
        {user?.role !== "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl bg-card card-shadow border border-border p-5">
            <h2 className="text-lg font-bold mb-4">User Profile Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>User Name</span><span className="font-medium">{profile.name}</span></div>
              <div className="flex items-center justify-between"><span>Business Type</span><span className="font-medium">{profile.businessType}</span></div>
              <div className="flex items-center justify-between"><span>Startup Stage</span><span className="font-medium">{profile.startupStage}</span></div>
              <div className="flex items-center justify-between"><span>Region / State</span><span className="font-medium">{profile.region}</span></div>
            </div>
            <div className="mt-4">
              <div className="h-2 rounded bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.round(profileCompletion * 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Profile completion: {Math.round(profileCompletion * 100)}%</p>
            </div>
          </div>
          <div className="rounded-xl bg-card card-shadow border border-border p-5">
            <h2 className="text-lg font-bold mb-4">Scheme Discovery Overview</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Total schemes available</p>
                <p className="text-xl font-bold">{schemesData.length}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Recently updated</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/schemes" className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-[#0056b3] text-white text-sm">Explore Schemes</a>
            </div>
          </div>
          <div className="rounded-xl bg-card card-shadow border border-border p-5">
            <h2 className="text-lg font-bold mb-4">Eligibility Snapshot</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Likely Eligible</p>
                <p className="text-xl font-bold text-success">{eligibilityBuckets.likely}</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Possibly Eligible</p>
                <p className="text-xl font-bold text-warning">{eligibilityBuckets.possibly}</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Not Eligible</p>
                <p className="text-xl font-bold text-destructive">{eligibilityBuckets.notEligible}</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Explore Schemes */}
        {user?.role !== "admin" && (
        <section ref={schemesRef} id="explore-schemes">
          <h2 className="text-xl font-bold mb-4">Explore Schemes</h2>
          <SchemeFilters
            region={regionFilter}
            businessType={businessFilter}
            stage={stageFilter}
            onRegionChange={setRegionFilter}
            onBusinessTypeChange={setBusinessFilter}
            onStageChange={setStageFilter}
            onApply={handleApplyFilters}
          />
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Government Schemes</h3>
                <span className="text-xs text-muted-foreground">
                  Source: Official portals (startupindia.gov.in, state .gov.in)
                </span>
              </div>
              <div className="space-y-3">
                {governmentSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} onViewDetails={handleViewDetails} />
                ))}
                {governmentSchemes.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No government schemes match your filters.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Private & VC Programs</h3>
                <span className="text-xs text-muted-foreground">
                  Source: VC funds, accelerators & angel networks
                </span>
              </div>
              <div className="space-y-3">
                {privateSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} onViewDetails={handleViewDetails} />
                ))}
                {privateSchemes.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No private programs match your filters.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Eligibility + Tracker */}
        {user?.role !== "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div ref={eligibilityRef} id="eligibility-section">
            <EligibilitySection scheme={lastViewedScheme} profile={profile} />
          </div>
          <div ref={trackerRef} id="application-tracker">
            <ApplicationTracker applications={applications} onStatusChange={handleStatusChange} />
          </div>
        </div>
        )}

        {/* Saved Schemes */}
        <div ref={savedRef} id="saved-schemes">
          <SavedSchemes
            applications={applications}
            onViewDetails={(id) => {
              const scheme = schemesData.find(s => s.id === id);
              if (scheme) handleViewDetails(scheme);
            }}
            onUpdateStatus={(id, status) => handleStatusChange(id, status)}
            onRemove={(id) => setApplications(prev => prev.filter(a => !(a.schemeId === id && a.interested)))}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl bg-card card-shadow border border-border p-5">
            <h2 className="text-lg font-bold mb-4">Application Progress Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Total applications</p>
                <p className="text-xl font-bold">{totalApplications}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Success rate</p>
                <p className="text-xl font-bold">{successRate}%</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card card-shadow border border-border p-5">
            <h2 className="text-lg font-bold mb-4">Required Documents & Guidance</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Business Registration</span><Badge variant="outline">Pending</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>PAN / GST</span><Badge variant="outline">Uploaded</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>Pitch Deck</span><Badge variant="outline">Pending</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>Bank Details</span><Badge variant="outline">Pending</Badge>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">Statuses are placeholders.</p>
          </div>
          <div className="rounded-xl bg-card card-shadow border border-border p-5">
            <h2 className="text-lg font-bold mb-4">Alerts & Notifications</h2>
            <ul className="space-y-2 text-sm">
              <li>Upcoming deadlines: {schemesData.slice(0, 2).map(s => s.name).join(", ")}</li>
              <li>Status updates: {applications.filter(a => a.status !== "Not Applied").length}</li>
              <li>New schemes matching profile: {filteredSchemes.length}</li>
              <li>Incomplete applications: {applications.filter(a => a.status === "Not Applied" && a.interested).length}</li>
            </ul>
          </div>
        </div>
        <div className="rounded-xl bg-card card-shadow border border-border p-5">
          <h2 className="text-lg font-bold mb-4">Settings & Help</h2>
          <div className="flex items-center gap-3">
            <a href="/profile" className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm">Edit profile</a>
            <a href="/profile" className="inline-flex items-center justify-center h-9 px-3 rounded-md border text-sm">Change region/business type</a>
            <a href="/start" className="inline-flex items-center justify-center h-9 px-3 rounded-md border text-sm">Help / FAQs</a>
          </div>
        </div>
      </main>

      {/* Scheme Detail Dialog */}
      <SchemeDetailDialog
        scheme={selectedScheme}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={profile}
        onMarkInterested={handleMarkInterested}
        isInterested={selectedScheme ? isInterested(selectedScheme.id) : false}
      />
    </div>
  );
};

export default Index;
