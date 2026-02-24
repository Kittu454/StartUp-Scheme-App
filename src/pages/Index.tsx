import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SchemeFilters from "@/components/SchemeFilters";
import SchemeCard from "@/components/SchemeCard";
import SchemeDetailDialog from "@/components/SchemeDetailDialog";
import EligibilitySection from "@/components/EligibilitySection";
import ApplicationTracker from "@/components/ApplicationTracker";
import DashboardSummary from "@/components/DashboardSummary";
import SavedSchemes from "@/components/SavedSchemes";
import {
  defaultProfile,
  schemesData,
  initialApplications,
  Scheme,
  Application,
  ApplicationStatus,
} from "@/data/schemes";

const Index = () => {
  const [profile] = useState(defaultProfile);
  const [regionFilter, setRegionFilter] = useState("All");
  const [businessFilter, setBusinessFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [appliedFilters, setAppliedFilters] = useState({ region: "All", business: "All", stage: "All" });
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [lastViewedScheme, setLastViewedScheme] = useState<Scheme | null>(null);

  const filteredSchemes = useMemo(() => {
    return schemesData.filter(s => {
      if (appliedFilters.region !== "All" && s.region !== appliedFilters.region && s.region !== "Central") return false;
      if (appliedFilters.business !== "All" && s.businessType !== appliedFilters.business) return false;
      if (appliedFilters.stage !== "All" && s.requiredStage !== appliedFilters.stage) return false;
      return true;
    });
  }, [appliedFilters]);

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

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        {/* Dashboard Summary */}
        <DashboardSummary applications={applications} />

        {/* Explore Schemes */}
        <section>
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
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchemes.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} onViewDetails={handleViewDetails} />
            ))}
            {filteredSchemes.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full py-8 text-center">No schemes match your filters.</p>
            )}
          </div>
        </section>

        {/* Eligibility + Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EligibilitySection scheme={lastViewedScheme} profile={profile} />
          <ApplicationTracker applications={applications} onStatusChange={handleStatusChange} />
        </div>

        {/* Saved Schemes */}
        <SavedSchemes applications={applications} />
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
