export interface UserProfile {
  name: string;
  businessType: string;
  region: string;
  startupStage: string;
}

export interface Scheme {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  deadline: string;
  authority: string;
  region: string;
  businessType: string;
  requiredStage: string;
  requirements: string[];
  documents: string[];
  maxFunding?: string;
  category?: "Government" | "Private" | "Incubator";
  sourceType: "Government" | "Private";
  websiteUrl: string;
}

export type ApplicationStatus = "Not Applied" | "Applied" | "Under Review" | "Approved" | "Rejected";

export interface Application {
  schemeId: string;
  status: ApplicationStatus;
  date: string;
  interested: boolean;
}

export const regions = ["All", "Telangana", "Karnataka", "Maharashtra", "Central", "Tamil Nadu"];
export const businessTypes = ["All", "Tech", "Manufacturing", "Agriculture", "Healthcare", "Education"];
export const startupStages = ["All", "Idea Stage", "Early Stage", "Growth Stage", "Scaling"];

export const defaultProfile: UserProfile = {
  name: "Krishna",
  businessType: "Tech",
  region: "Telangana",
  startupStage: "Early Stage",
};

export const schemesData: Scheme[] = [
  {
    id: "1",
    name: "Startup India Seed Fund Scheme (SISFS)",
    shortDescription: "Up to ₹20 Lakhs grant & ₹50 Lakhs investment",
    fullDescription:
      "The Startup India Seed Fund Scheme (SISFS) provides financial assistance through incubators for proof of concept, prototype development, product trials, market entry and commercialization for DPIIT-recognised startups.",
    benefits: [
      "Grant support up to ₹20 Lakhs for PoC, prototype or product trials",
      "Investment support up to ₹50 Lakhs as convertible debentures or debt",
      "Access to a national network of accredited incubators and mentors",
    ],
    deadline: "31 Mar 2026",
    authority: "DPIIT, Govt of India",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: [
      "DPIIT registered startup",
      "Incorporated not more than 2 years ago at the time of application",
      "Technology-led product or service with high market potential",
      "Not raised more than ₹10 Lakhs from other Central/State schemes (excluding prize money)",
    ],
    documents: ["DPIIT Recognition Certificate", "Incorporation Certificate", "Pitch Deck", "Founders KYC", "Financial Projections"],
    maxFunding: "Up to ₹70 Lakhs (grant + debt)",
    category: "Government",
    sourceType: "Government",
    websiteUrl: "https://seedfund.startupindia.gov.in/",
  },
  {
    id: "2",
    name: "MeitY SAMRIDH Accelerator",
    shortDescription: "Matching funding up to ₹40 Lakhs",
    fullDescription:
      "SAMRIDH (Startup Accelerators of MeitY for Product Innovation, Development and Growth) supports digital and software product startups through accelerator partners with market access, mentoring and matching investment support.",
    benefits: [
      "Co-investment funding up to ₹40 Lakhs per startup",
      "Structured accelerator program with expert mentors",
      "Access to MeitY Startup Hub and investor network",
    ],
    deadline: "30 Sep 2026",
    authority: "MeitY Startup Hub, Ministry of Electronics & IT",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Growth Stage",
    requirements: [
      "DPIIT registered startup with Indian founders holding at least 51% equity",
      "SaaS / digital / software product with early traction or MVP",
      "Minimum ₹40 Lakhs committed from angels or VCs for matching investment",
    ],
    documents: ["DPIIT Certificate", "Cap Table", "Investor Commitment Letter", "Pitch Deck"],
    maxFunding: "Up to ₹40 Lakhs (matching)",
    category: "Government",
    sourceType: "Government",
    websiteUrl: "https://meitystartuphub.in/schemes/samridh",
  },
  {
    id: "3",
    name: "T-Fund – Telangana Early Stage Fund",
    shortDescription: "Equity funding between ₹25 Lakhs – ₹1 Crore",
    fullDescription:
      "T-Fund is a co-investment fund managed by T-Hub and backed by the Telangana government to support early-stage technology startups alongside angels and venture capital funds.",
    benefits: [
      "Average ticket size between ₹25 Lakhs and ₹1 Crore",
      "Co-investment alongside institutional angels or VCs",
      "Support from T-Hub’s ecosystem, mentors and programs",
    ],
    deadline: "31 Dec 2026",
    authority: "T-Hub, Govt of Telangana",
    region: "Telangana",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: [
      "Registered company headquartered in Telangana or willing to relocate",
      "Early revenues or strong pilots in place",
      "At least 50% of the round already committed by external investors",
    ],
    documents: ["Incorporation Certificate", "Latest Financials", "Investor Term Sheets", "Pitch Deck"],
    maxFunding: "₹25 Lakhs – ₹1 Crore",
    category: "Government",
    sourceType: "Government",
    websiteUrl: "https://startup.telangana.gov.in/funding-incentives/",
  },
  {
    id: "4",
    name: "Karnataka Elevate 100",
    shortDescription: "Grant support up to ₹50 Lakhs",
    fullDescription:
      "Elevate 100 is Karnataka’s flagship startup program that identifies innovative startups and provides them with grants, mentoring, market access and government pilot opportunities.",
    benefits: [
      "Seed grant support up to ₹50 Lakhs",
      "Access to government departments for pilot projects",
      "Mentorship and visibility through the Elevate platform",
    ],
    deadline: "15 May 2026",
    authority: "Govt of Karnataka",
    region: "Karnataka",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: [
      "Karnataka-registered startup or willing to move operations to the state",
      "Innovative product or service with scalable model",
      "Startup not older than 5 years at the time of application",
    ],
    documents: ["Certificate of Incorporation", "Pitch Deck", "Business Plan", "Founders KYC"],
    maxFunding: "Up to ₹50 Lakhs",
    category: "Government",
    sourceType: "Government",
    websiteUrl: "https://startup.karnataka.gov.in/elevate",
  },
  {
    id: "5",
    name: "PRISM – Prototype Support (Category 1)",
    shortDescription: "Grants for innovators to build prototypes",
    fullDescription:
      "PRISM (Promoting Innovations in Individuals, Startups and MSMEs) by DSIR provides financial support to individual innovators and startups to build proof-of-concept models and functional prototypes.",
    benefits: [
      "Grant support up to 90% of project cost, subject to a maximum of ₹2 Lakhs",
      "Mentoring support through PRISM centres and technical institutions",
      "IP ownership retained by the innovator/startup",
    ],
    deadline: "31 Dec 2026",
    authority: "Department of Scientific and Industrial Research (DSIR)",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Idea Stage",
    requirements: [
      "Innovative, commercially viable idea with clear problem statement",
      "Individual innovator, startup or MSME based in India",
      "Project not funded under any other government scheme for the same scope",
    ],
    documents: ["Concept Note", "Aadhaar / PAN", "Budget Sheet", "Recommendation / Mentor Letter (if available)"],
    maxFunding: "Up to ₹2 Lakhs",
    category: "Government",
    sourceType: "Government",
    websiteUrl: "https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism",
  },
  {
    id: "6",
    name: "Tax Exemption under Section 80-IAC",
    shortDescription: "100% tax exemption on profits for 3 consecutive years",
    fullDescription:
      "Eligible startups recognised by DPIIT can avail 100% income tax exemption on profits under Section 80-IAC of the Income Tax Act for any 3 consecutive assessment years out of 10 years from incorporation.",
    benefits: [
      "100% corporate income tax holiday on profits for 3 consecutive years",
      "Improved cash runway for early-stage startups",
      "Available within a 10-year window from date of incorporation",
    ],
    deadline: "31 Dec 2026",
    authority: "CBDT & DPIIT, Govt of India",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Growth Stage",
    requirements: [
      "Private limited company or LLP incorporated in India",
      "DPIIT-recognised eligible startup",
      "Turnover not exceeding ₹100 Crores in any financial year since incorporation",
    ],
    documents: ["DPIIT Certificate", "Incorporation Documents", "Past Financial Statements", "Income Tax Filings"],
    maxFunding: "Tax holiday (indirect monetary benefit)",
    category: "Government",
    sourceType: "Government",
    websiteUrl: "https://www.startupindia.gov.in/content/sih/en/startupgov/income-tax-exemption.html",
  },
  {
    id: "7",
    name: "Sequoia Surge",
    shortDescription: "VC-backed rapid scaleup program",
    fullDescription:
      "Surge is a rapid scale-up program by Sequoia Capital for early-stage startups across India and Southeast Asia, combining capital with hands-on company-building support.",
    benefits: [
      "Equity funding starting from around US$1M",
      "Access to Sequoia Capital’s operating partners and network",
      "Community of high-growth founders across India and SEA",
    ],
    deadline: "Rolling cohorts in 2026",
    authority: "Sequoia Capital India & SEA",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: [
      "Tech or tech-enabled startup with large market opportunity",
      "Founding team committed full time",
      "Strong product vision and early customer validation",
    ],
    documents: ["Pitch Deck", "Cap Table", "Product Demo", "Key Metrics"],
    maxFunding: "From ~US$1M (varies by cohort)",
    category: "Private",
    sourceType: "Private",
    websiteUrl: "https://www.surgeahead.com/",
  },
  {
    id: "8",
    name: "Accel Atoms",
    shortDescription: "Pre-seed program by Accel",
    fullDescription:
      "Accel Atoms is a pre-seed program by Accel offering capital and mentorship to very early-stage startups building from India for global markets.",
    benefits: [
      "Pre-seed capital and follow-on funding opportunities from Accel",
      "Dedicated mentorship from Accel partners and operators",
      "Support with hiring, GTM and future fundraising",
    ],
    deadline: "Cohort-based with rolling applications",
    authority: "Accel India",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Idea Stage",
    requirements: [
      "Pre-seed or seed stage startup building a technology product",
      "Small, committed founding team",
      "Clear thesis on problem, market and product direction",
    ],
    documents: ["Pitch Deck", "Founders Profile", "Product Overview"],
    maxFunding: "Varies by startup",
    category: "Private",
    sourceType: "Private",
    websiteUrl: "https://atoms.accel.com/",
  },
];

export const initialApplications: Application[] = [
  { schemeId: "1", status: "Approved", date: "24/02/2026", interested: true },
  { schemeId: "2", status: "Applied", date: "18/02/2026", interested: true },
  { schemeId: "4", status: "Under Review", date: "20/02/2026", interested: true },
];
