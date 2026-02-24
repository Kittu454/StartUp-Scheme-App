import { regions, businessTypes, startupStages } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SchemeFiltersProps {
  region: string;
  businessType: string;
  stage: string;
  onRegionChange: (v: string) => void;
  onBusinessTypeChange: (v: string) => void;
  onStageChange: (v: string) => void;
  onApply: () => void;
}

const SchemeFilters = ({ region, businessType, stage, onRegionChange, onBusinessTypeChange, onStageChange, onApply }: SchemeFiltersProps) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Region</label>
        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Business Type</label>
        <Select value={businessType} onValueChange={onBusinessTypeChange}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>{businessTypes.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Startup Stage</label>
        <Select value={stage} onValueChange={onStageChange}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>{startupStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button onClick={onApply}>Apply Filters</Button>
    </div>
  );
};

export default SchemeFilters;
