import { Scheme } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import { Calendar, Building2 } from "lucide-react";

interface SchemeCardProps {
  scheme: Scheme;
  onViewDetails: (scheme: Scheme) => void;
}

const SchemeCard = ({ scheme, onViewDetails }: SchemeCardProps) => {
  return (
    <div className="group rounded-xl bg-card card-shadow hover:card-shadow-hover transition-all duration-200 overflow-hidden border border-border">
      <div className="header-gradient px-4 py-3">
        <h3 className="font-bold text-primary-foreground text-sm">{scheme.name}</h3>
      </div>
      <div className="px-4 py-4 space-y-3">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          {scheme.shortDescription}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          Ends: {scheme.deadline}
        </p>
        <Button size="sm" className="w-full" onClick={() => onViewDetails(scheme)}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default SchemeCard;
