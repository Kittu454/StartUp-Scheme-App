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

  const studentRows = useMemo(() => {
    return users
      .filter((u) => u.role === "student")
      .map((student) => {
        const apps = loadApplicationsForUser(student.id);
        const summary = summarizeApplications(apps);
        return { student, summary };
      });
  }, [users]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Dashboard – Students Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Startup Stage</TableHead>
                  <TableHead className="text-center">Applied</TableHead>
                  <TableHead className="text-center">Under Review</TableHead>
                  <TableHead className="text-center">Approved</TableHead>
                  <TableHead className="text-center">Rejected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-6">
                      No student accounts found yet.
                    </TableCell>
                  </TableRow>
                )}
                {studentRows.map(({ student, summary }) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.startupStage ?? "—"}</TableCell>
                    <TableCell className="text-center">{summary.applied}</TableCell>
                    <TableCell className="text-center">{summary.underReview}</TableCell>
                    <TableCell className="text-center">{summary.approved}</TableCell>
                    <TableCell className="text-center">{summary.rejected}</TableCell>
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

