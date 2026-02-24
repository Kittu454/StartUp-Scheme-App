import { Scheme, UserProfile } from "@/data/schemes";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

interface EligibilitySectionProps {
  scheme: Scheme | null;
  profile: UserProfile;
}

const EligibilitySection = ({ scheme, profile }: EligibilitySectionProps) => {
  if (!scheme) {
    return (
      <div className="rounded-xl bg-card card-shadow border border-border p-5">
        <h2 className="text-lg font-bold mb-4">Eligibility Criteria</h2>
        <p className="text-sm text-muted-foreground">Select a scheme to view eligibility details.</p>
      </div>
    );
  }

  const isEligible =
    (scheme.region === "Central" || scheme.region === profile.region) &&
    (scheme.businessType === profile.businessType || scheme.businessType === "All") &&
    scheme.requiredStage === profile.startupStage;

  return (
    <div className="rounded-xl bg-card card-shadow border border-border p-5">
      <h2 className="text-lg font-bold mb-4">Eligibility Criteria</h2>
      <p className="text-xs text-muted-foreground mb-3">For: {scheme.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Requirements</h4>
          <ul className="space-y-1.5">
            {scheme.requirements.map(r => (
              <li key={r} className="text-sm flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />{r}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Documents Needed</h4>
          <div className="space-y-1.5">
            {scheme.documents.map(d => (
              <div key={d} className="text-sm flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />{d}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Eligibility Status</h4>
          <div className={`mt-2 rounded-lg p-4 flex flex-col items-center gap-2 ${isEligible ? 'bg-success/10' : 'bg-destructive/10'}`}>
            {isEligible ? (
              <><CheckCircle2 className="h-8 w-8 text-success" /><span className="text-sm font-semibold text-success text-center">You Appear Eligible</span></>
            ) : (
              <><XCircle className="h-8 w-8 text-destructive" /><span className="text-sm font-semibold text-destructive text-center">May Not Be Eligible</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilitySection;
