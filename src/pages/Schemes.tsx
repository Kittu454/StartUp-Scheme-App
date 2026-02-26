import { useMemo, useState } from "react";
import { schemesData, Scheme, businessTypes, regions } from "@/data/schemes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const detectFundingType = (s: Scheme): "Grant" | "Equity" | "Tax" | "Other" => {
  const text = `${s.fullDescription} ${s.benefits.join(" ")}`.toLowerCase();
  if (text.includes("grant")) return "Grant";
  if (text.includes("equity") || text.includes("funding")) return "Equity";
  if (text.includes("tax")) return "Tax";
  return "Other";
};

const computeEligibility = (s: Scheme, profile: { businessType: string; region: string; startupStage: string }) => {
  const regionOk = s.region === "Central" || s.region === profile.region;
  const btOk = s.businessType === profile.businessType || s.businessType === "All";
  const stageOk = s.requiredStage === profile.startupStage;
  if (regionOk && btOk && stageOk) return "Likely";
  if ((regionOk && btOk) || (regionOk && stageOk) || (btOk && stageOk)) return "Possible";
  return "Not";
};

const Schemes = () => {
  const profile = { businessType: "Tech", region: "Telangana", startupStage: "Early Stage" };

  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("All");
  const [state, setState] = useState("All");
  const [funding, setFunding] = useState<"All" | "Grant" | "Equity" | "Tax" | "Other">("All");
  const [eligibility, setEligibility] = useState<"All" | "Likely" | "Possible" | "Not">("All");

  const results = useMemo(() => {
    return schemesData
      .filter((s) => (industry === "All" ? true : s.businessType === industry))
      .filter((s) => (state === "All" ? true : s.region === state || s.region === "Central"))
      .filter((s) => {
        const ft = detectFundingType(s);
        return funding === "All" ? true : ft === funding;
      })
      .filter((s) => {
        const tag = computeEligibility(s, profile);
        return eligibility === "All" ? true : tag === eligibility;
      })
      .filter((s) => (q ? s.name.toLowerCase().includes(q.toLowerCase()) : true))
      .slice(0, 8);
  }, [q, industry, state, funding, eligibility]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-[#003366] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Schemes Discovery</h1>
          <a href="/dashboard" className="text-sm hover:opacity-90">Back to Dashboard</a>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 rounded-md border bg-card p-4">
            <h2 className="text-sm font-semibold mb-3">Search & Filter</h2>
            <div className="space-y-3">
              <Input placeholder="Search schemes…" value={q} onChange={(e) => setQ(e.target.value)} />
              <div>
                <label className="text-xs font-medium">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{businessTypes.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium">State</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium">Funding Type</label>
                <Select value={funding} onValueChange={(v) => setFunding(v as any)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["All", "Grant", "Equity", "Tax", "Other"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium">Eligibility</label>
                <Select value={eligibility} onValueChange={(v) => setEligibility(v as any)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["All", "Likely", "Possible", "Not"].map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((s) => (
                <Card key={s.id} className="rounded-md border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{s.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <Button size="sm" onClick={() => window.open(s.websiteUrl, "_blank")}>View Details</Button>
                      <span className="text-xs text-muted-foreground">{s.region}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {results.length === 0 && (
                <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">No schemes found for your filters.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Schemes;
