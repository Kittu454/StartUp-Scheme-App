import { Scheme } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, ExternalLink } from "lucide-react";

interface SchemeCardProps {
  scheme: Scheme;
  onViewDetails?: (scheme: Scheme) => void;
}

const SchemeCard = ({ scheme, onViewDetails }: SchemeCardProps) => {
  const handleOpenOfficial = () => {
    if (scheme.websiteUrl) {
      window.open(scheme.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="group rounded-xl bg-card card-shadow hover:card-shadow-hover transition-all duration-200 overflow-hidden border border-border">
      <div className="header-gradient px-4 py-3 flex items-center justify-between gap-2">
        <h3 className="font-bold text-primary-foreground text-sm line-clamp-2">{scheme.name}</h3>
        <Badge
          variant="secondary"
          className={`text-[10px] font-semibold ${
            scheme.sourceType === "Government"
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-yellow-400/20 text-yellow-900"
          }`}
        >
          {scheme.sourceType === "Government" ? "Government" : "Private"}
        </Badge>
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
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 hover:shadow-md"
            onClick={onViewDetails ? () => onViewDetails(scheme) : handleOpenOfficial}
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 hover:shadow-md"
            onClick={handleOpenOfficial}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;
