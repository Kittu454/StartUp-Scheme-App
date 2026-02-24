import { Scheme, UserProfile } from "@/data/schemes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Calendar, Building2, Star } from "lucide-react";

interface SchemeDetailDialogProps {
  scheme: Scheme | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onMarkInterested: (schemeId: string) => void;
  isInterested: boolean;
}

const SchemeDetailDialog = ({ scheme, open, onOpenChange, profile, onMarkInterested, isInterested }: SchemeDetailDialogProps) => {
  if (!scheme) return null;

  const isEligible =
    (scheme.region === "Central" || scheme.region === profile.region) &&
    (scheme.businessType === profile.businessType || scheme.businessType === "All") &&
    scheme.requiredStage === profile.startupStage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{scheme.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">{scheme.authority}</p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <p className="text-sm leading-relaxed">{scheme.fullDescription}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-primary" /> Deadline: {scheme.deadline}</span>
            <span className="flex items-center gap-1"><Building2 className="h-4 w-4 text-primary" /> {scheme.region}</span>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Benefits</h4>
            <ul className="space-y-1">
              {scheme.benefits.map(b => (
                <li key={b} className="text-sm flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Eligibility Requirements</h4>
            <ul className="space-y-1">
              {scheme.requirements.map(r => (
                <li key={r} className="text-sm flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary shrink-0" />{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Documents Needed</h4>
            <div className="flex flex-wrap gap-2">
              {scheme.documents.map(d => (
                <Badge key={d} variant="secondary" className="gap-1"><FileText className="h-3 w-3" />{d}</Badge>
              ))}
            </div>
          </div>

          <div className={`rounded-lg p-3 flex items-center gap-3 ${isEligible ? 'bg-success/10' : 'bg-destructive/10'}`}>
            {isEligible ? (
              <><CheckCircle2 className="h-5 w-5 text-success" /><span className="text-sm font-medium text-success">You appear eligible for this scheme</span></>
            ) : (
              <><XCircle className="h-5 w-5 text-destructive" /><span className="text-sm font-medium text-destructive">You may not be eligible based on your profile</span></>
            )}
          </div>

          <Button onClick={() => onMarkInterested(scheme.id)} variant={isInterested ? "secondary" : "default"} className="w-full gap-2">
            <Star className="h-4 w-4" fill={isInterested ? "currentColor" : "none"} />
            {isInterested ? "Saved to Interested" : "Mark as Interested"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchemeDetailDialog;
