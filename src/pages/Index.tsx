import { useState, useMemo, useRef, useEffect } from "react";
import Header from "@/components/Header";
import SchemeFilters from "@/components/SchemeFilters";
import SchemeCard from "@/components/SchemeCard";
import SchemeDetailDialog from "@/components/SchemeDetailDialog";
import EligibilitySection from "@/components/EligibilitySection";
import ApplicationTracker from "@/components/ApplicationTracker";
import DashboardSummary from "@/components/DashboardSummary";
import SavedSchemes from "@/components/SavedSchemes";
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

        {/* Explore Schemes */}
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

        {/* Eligibility + Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div ref={eligibilityRef} id="eligibility-section">
            <EligibilitySection scheme={lastViewedScheme} profile={profile} />
          </div>
          <div ref={trackerRef} id="application-tracker">
            <ApplicationTracker applications={applications} onStatusChange={handleStatusChange} />
          </div>
        </div>

        {/* Saved Schemes */}
        <div ref={savedRef} id="saved-schemes">
          <SavedSchemes applications={applications} />
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
