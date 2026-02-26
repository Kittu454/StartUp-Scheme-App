import { Application, ApplicationStatus, schemesData } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInCalendarDays, parse } from "date-fns";
import { Star } from "lucide-react";

interface SavedSchemesProps {
  applications: Application[];
  onViewDetails?: (schemeId: string) => void;
  onUpdateStatus?: (schemeId: string, status: ApplicationStatus) => void;
  onRemove?: (schemeId: string) => void;
}

const statusBadgeClass: Record<string, string> = {
  "Not Applied": "bg-muted text-muted-foreground",
  "Applied": "bg-primary/10 text-primary",
  "Under Review": "bg-warning/10 text-warning",
  "Approved": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const SavedSchemes = ({ applications, onViewDetails, onUpdateStatus, onRemove }: SavedSchemesProps) => {
  const saved = applications.filter(a => a.interested);

  const daysUntil = (deadline: string) => {
    try {
      const parsed = parse(deadline, "dd MMM yyyy", new Date());
      return differenceInCalendarDays(parsed, new Date());
    } catch {
      return null;
    }
  };

  return (
    <div className="rounded-xl bg-card card-shadow border border-border p-5">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-accent" fill="currentColor" />
        Saved Schemes
      </h2>
      {saved.length === 0 ? (
        <p className="text-sm text-muted-foreground">No saved schemes yet.</p>
      ) : (
        <ul className="space-y-3">
          {saved.map(app => {
            const scheme = schemesData.find(s => s.id === app.schemeId);
            if (!scheme) return null;
            const days = daysUntil(scheme.deadline);
            return (
              <li key={app.schemeId} className="py-3 border-b last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                    <span className="text-sm font-medium">{scheme.name}</span>
                    <span className="text-xs text-muted-foreground">· {scheme.authority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusBadgeClass[app.status]}>{app.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {days === null ? "—" : days >= 0 ? `D-${days}` : `Past due`}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => onViewDetails?.(app.schemeId)}>View Details</Button>
                    <Button size="sm" variant="outline" onClick={() => onRemove?.(app.schemeId)}>Remove</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Update Status:</span>
                    <Select value={app.status} onValueChange={(v) => onUpdateStatus?.(app.schemeId, v as ApplicationStatus)}>
                      <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(statusBadgeClass).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SavedSchemes;
