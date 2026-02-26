import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApplicationStatus } from "@/data/schemes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ApplicationSummary {
  applied: number;
  underReview: number;
  approved: number;
  rejected: number;
}

interface StoredApplication {
  schemeId: string;
  status: ApplicationStatus;
  date: string;
  interested: boolean;
}

const loadApplicationsForUser = (userId: string): StoredApplication[] => {
  try {
    const raw = window.localStorage.getItem(`startup-keeper-apps-${userId}`);
    if (!raw) return [];
    return JSON.parse(raw) as StoredApplication[];
  } catch {
    return [];
  }
};

const summarizeApplications = (apps: StoredApplication[]): ApplicationSummary => {
  return apps.reduce<ApplicationSummary>(
    (acc, app) => {
      if (app.status === "Applied") acc.applied += 1;
      if (app.status === "Under Review") acc.underReview += 1;
      if (app.status === "Approved") acc.approved += 1;
      if (app.status === "Rejected") acc.rejected += 1;
      return acc;
    },
    { applied: 0, underReview: 0, approved: 0, rejected: 0 },
  );
};

const AdminDashboard = () => {
  const { users } = useAuth();

  const rows = useMemo(() => {
    return users
      .filter((u) => u.role === "entrepreneur")
      .map((e) => {
        const apps = loadApplicationsForUser(e.id);
        const summary = summarizeApplications(apps);
        return { entrepreneur: e, summary };
      });
  }, [users]);

  const bulkUpdate = (userId: string, nextStatus: ApplicationStatus) => {
    try {
      const apps = loadApplicationsForUser(userId);
      const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
      const updated = apps.map(a =>
        a.status === "Under Review" || a.status === "Applied"
          ? { ...a, status: nextStatus, date: today }
          : a,
      );
      window.localStorage.setItem(`startup-keeper-apps-${userId}`, JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Panel – Entrepreneurs Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-center">Applied</TableHead>
                  <TableHead className="text-center">Under Review</TableHead>
                  <TableHead className="text-center">Approved</TableHead>
                  <TableHead className="text-center">Rejected</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-6">
                      No entrepreneur accounts found yet.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map(({ entrepreneur, summary }) => (
                  <TableRow key={entrepreneur.id}>
                    <TableCell className="font-medium">{entrepreneur.name}</TableCell>
                    <TableCell>{entrepreneur.email}</TableCell>
                    <TableCell>{entrepreneur.businessType ?? "—"}</TableCell>
                    <TableCell>{entrepreneur.region ?? "—"}</TableCell>
                    <TableCell className="text-center">{summary.applied}</TableCell>
                    <TableCell className="text-center">{summary.underReview}</TableCell>
                    <TableCell className="text-center">{summary.approved}</TableCell>
                    <TableCell className="text-center">{summary.rejected}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="h-8 px-3 rounded-md border text-xs"
                          onClick={() => bulkUpdate(entrepreneur.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="h-8 px-3 rounded-md border text-xs"
                          onClick={() => bulkUpdate(entrepreneur.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;

