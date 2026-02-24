import { Application, ApplicationStatus, schemesData } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationTrackerProps {
  applications: Application[];
  onStatusChange: (schemeId: string, status: ApplicationStatus) => void;
}

const statusColors: Record<ApplicationStatus, string> = {
  "Not Applied": "bg-muted text-muted-foreground",
  "Applied": "bg-primary/10 text-primary",
  "Under Review": "bg-warning/10 text-warning",
  "Approved": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const allStatuses: ApplicationStatus[] = ["Not Applied", "Applied", "Under Review", "Approved", "Rejected"];

const ApplicationTracker = ({ applications, onStatusChange }: ApplicationTrackerProps) => {
  const activeApps = applications.filter(a => a.status !== "Not Applied" || a.interested);

  return (
    <div className="rounded-xl bg-card card-shadow border border-border p-5">
      <h2 className="text-lg font-bold mb-4">Application Tracker</h2>
      {activeApps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet. Mark schemes as interested to start tracking.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Scheme</th>
                <th className="text-left py-2 font-semibold">Status</th>
                <th className="text-left py-2 font-semibold">Date</th>
                <th className="text-left py-2 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody>
              {activeApps.map(app => {
                const scheme = schemesData.find(s => s.id === app.schemeId);
                if (!scheme) return null;
                return (
                  <tr key={app.schemeId} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{scheme.name}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className={statusColors[app.status]}>{app.status}</Badge>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{app.date || "—"}</td>
                    <td className="py-2.5">
                      <Select value={app.status} onValueChange={(v) => onStatusChange(app.schemeId, v as ApplicationStatus)}>
                        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
