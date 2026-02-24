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
    name: "Startup India Seed Fund",
    shortDescription: "Funding up to ₹50 Lakhs",
    fullDescription: "The Startup India Seed Fund Scheme provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    benefits: ["Up to ₹50 Lakhs funding", "Mentorship support", "Networking opportunities"],
    deadline: "30 June 2026",
    authority: "DPIIT, Govt of India",
    region: "Central",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: ["DPIIT Registered", "Startup age < 5 years", "Annual turnover < ₹100 Cr"],
    documents: ["PAN Card", "Incorporation Certificate", "Pitch Deck", "Financial Statements"],
  },
  {
    id: "2",
    name: "MSME Innovation Scheme",
    shortDescription: "R&D Grants for SMEs",
    fullDescription: "Provides grants to micro, small, and medium enterprises for research and development activities aimed at improving products and processes.",
    benefits: ["R&D grants up to ₹25 Lakhs", "Technical guidance", "Lab access"],
    deadline: "15 July 2026",
    authority: "Ministry of MSME",
    region: "Central",
    businessType: "Manufacturing",
    requiredStage: "Growth Stage",
    requirements: ["Valid MSME Registration", "Operational for 1+ years", "Turnover < ₹50 Cr"],
    documents: ["MSME Certificate", "GST Certificate", "Project Proposal", "PAN Card"],
  },
  {
    id: "3",
    name: "Tech Incubation Program",
    shortDescription: "Mentorship & Office Space",
    fullDescription: "A comprehensive incubation program providing workspace, mentorship, and access to investors for technology startups in Telangana.",
    benefits: ["Free office space for 1 year", "Mentor network access", "Investor connect events"],
    deadline: "31 Aug 2026",
    authority: "T-Hub, Telangana",
    region: "Telangana",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: ["Registered Startup", "Less than 3 years old", "Tech-based product"],
    documents: ["Incorporation Certificate", "Pitch Deck", "Team Details"],
  },
  {
    id: "4",
    name: "Karnataka Elevate Program",
    shortDescription: "Grants up to ₹50 Lakhs",
    fullDescription: "Elevate is a startup initiative by the Government of Karnataka that offers grants, mentoring, and networking for innovative startups.",
    benefits: ["Up to ₹50 Lakhs grant", "Government procurement opportunity", "Brand visibility"],
    deadline: "30 Sep 2026",
    authority: "Govt of Karnataka",
    region: "Karnataka",
    businessType: "Tech",
    requiredStage: "Early Stage",
    requirements: ["Karnataka registered entity", "Innovative product/service", "Less than 5 years old"],
    documents: ["Company Registration", "PAN Card", "Business Plan", "Pitch Deck"],
  },
  {
    id: "5",
    name: "Agri Innovation Fund",
    shortDescription: "Support for Agri-Tech startups",
    fullDescription: "Financial and technical assistance for startups working on agricultural innovation, including precision farming, supply chain, and agri-fintech.",
    benefits: ["Up to ₹30 Lakhs funding", "Access to field testing", "Market linkage support"],
    deadline: "15 Oct 2026",
    authority: "Ministry of Agriculture",
    region: "Central",
    businessType: "Agriculture",
    requiredStage: "Idea Stage",
    requirements: ["Agriculture-focused solution", "Indian registered entity", "Prototype ready"],
    documents: ["PAN Card", "Incorporation Certificate", "Prototype Documentation"],
  },
  {
    id: "6",
    name: "Healthcare Startup Scheme",
    shortDescription: "MedTech & HealthTech grants",
    fullDescription: "Grants and incubation support for startups developing healthcare solutions including medical devices, digital health platforms, and diagnostics.",
    benefits: ["Up to ₹75 Lakhs grant", "Clinical trial support", "Regulatory guidance"],
    deadline: "31 Dec 2026",
    authority: "Ministry of Health",
    region: "Maharashtra",
    businessType: "Healthcare",
    requiredStage: "Growth Stage",
    requirements: ["Healthcare-focused product", "DPIIT registered", "Clinical validation plan"],
    documents: ["DPIIT Certificate", "PAN Card", "Clinical Study Plan", "GST Certificate"],
  },
];

export const initialApplications: Application[] = [
  { schemeId: "2", status: "Applied", date: "05/02/2026", interested: true },
  { schemeId: "1", status: "Under Review", date: "06/10/2026", interested: true },
  { schemeId: "3", status: "Not Applied", date: "", interested: true },
];
