import { Application, schemesData } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import { Star, FileCheck, Clock, CheckCircle2, XCircle } from "lucide-react";

interface DashboardSummaryProps {
  applications: Application[];
}

const DashboardSummary = ({ applications }: DashboardSummaryProps) => {
  const applied = applications.filter(a => a.status === "Applied").length;
  const underReview = applications.filter(a => a.status === "Under Review").length;
  const approved = applications.filter(a => a.status === "Approved").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;
  const saved = applications.filter(a => a.interested).length;

  const stats = [
    { label: "Applied", count: applied, icon: FileCheck, color: "text-primary" },
    { label: "Under Review", count: underReview, icon: Clock, color: "text-warning" },
    { label: "Approved", count: approved, icon: CheckCircle2, color: "text-success" },
    { label: "Rejected", count: rejected, icon: XCircle, color: "text-destructive" },
    { label: "Saved", count: saved, icon: Star, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl bg-card card-shadow border border-border p-4 flex flex-col items-center gap-1">
          <s.icon className={`h-6 w-6 ${s.color}`} />
          <span className="text-2xl font-bold">{s.count}</span>
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
