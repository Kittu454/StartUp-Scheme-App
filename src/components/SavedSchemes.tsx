import { Application, schemesData } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface SavedSchemesProps {
  applications: Application[];
}

const statusBadgeClass: Record<string, string> = {
  "Not Applied": "bg-muted text-muted-foreground",
  "Applied": "bg-primary/10 text-primary",
  "Under Review": "bg-warning/10 text-warning",
  "Approved": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const SavedSchemes = ({ applications }: SavedSchemesProps) => {
  const saved = applications.filter(a => a.interested);

  return (
    <div className="rounded-xl bg-card card-shadow border border-border p-5">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-accent" fill="currentColor" />
        Saved Schemes
      </h2>
      {saved.length === 0 ? (
        <p className="text-sm text-muted-foreground">No saved schemes yet.</p>
      ) : (
        <ul className="space-y-2">
          {saved.map(app => {
            const scheme = schemesData.find(s => s.id === app.schemeId);
            if (!scheme) return null;
            return (
              <li key={app.schemeId} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                  <span className="text-sm font-medium">{scheme.name}</span>
                  <span className="text-xs text-muted-foreground">({app.status})</span>
                </div>
                <Badge variant="outline" className={statusBadgeClass[app.status]}>{app.status}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SavedSchemes;
