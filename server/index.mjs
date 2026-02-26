import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";

const db = new Database("data.db");
const app = express();
app.use(cors());
app.use(express.json());

function ensureSchema() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      provider TEXT NOT NULL,
      startupStage TEXT,
      businessType TEXT,
      region TEXT,
      createdAt TEXT NOT NULL
    )
  `).run();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS logins (
      username TEXT PRIMARY KEY,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `).run();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS schemes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      shortDescription TEXT NOT NULL,
      fullDescription TEXT NOT NULL,
      benefits TEXT NOT NULL,
      deadline TEXT NOT NULL,
      authority TEXT NOT NULL,
      region TEXT NOT NULL,
      businessType TEXT NOT NULL,
      requiredStage TEXT NOT NULL,
      requirements TEXT NOT NULL,
      documents TEXT NOT NULL,
      sourceType TEXT NOT NULL,
      websiteUrl TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `).run();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      schemeId TEXT NOT NULL,
      status TEXT NOT NULL,
      date TEXT,
      interested INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `).run();
}

function ensureSeed() {
  const countRow = db.prepare(`SELECT COUNT(*) as c FROM schemes`).get();
  if (countRow.c > 0) return;
  const schemes = [
    {
      name: "Startup India Seed Fund Scheme (SISFS)",
      shortDescription: "Up to ₹20 Lakhs grant & ₹50 Lakhs investment",
      fullDescription:
        "SISFS provides financial assistance to early-stage startups for proof of concept, prototype development, product trials, market entry and commercialization.",
      benefits: ["Up to ₹20 Lakhs grant", "Up to ₹50 Lakhs investment", "Mentor support via incubators"],
      deadline: "31 Mar 2026",
      authority: "DPIIT, Govt of India",
      region: "Central",
      businessType: "Tech",
      requiredStage: "Early Stage",
      requirements: ["DPIIT recognition", "Valid business plan", "Incubator tie-up"],
      documents: ["Pitch Deck", "Company Incorporation", "Financials"],
      sourceType: "Government",
      websiteUrl: "https://www.startupindia.gov.in/",
    },
    {
      name: "MeitY SAMRIDH",
      shortDescription: "Market development for startups via seed funding",
      fullDescription:
        "SAMRIDH supports startups with funding and mentorship to help them scale their products and reach markets.",
      benefits: ["Seed funding support", "Mentorship", "Market access"],
      deadline: "15 Apr 2026",
      authority: "MeitY, Govt of India",
      region: "Central",
      businessType: "Tech",
      requiredStage: "Growth Stage",
      requirements: ["Tech product", "Early revenue", "Team in place"],
      documents: ["Pitch Deck", "Financials", "Product Demo"],
      sourceType: "Government",
      websiteUrl: "https://www.meity.gov.in/",
    },
    {
      name: "PRISM (DSIR)",
      shortDescription: "Proof-of-concept grant for innovators",
      fullDescription:
        "PRISM provides grants to individual innovators and startups to develop proof-of-concept and prototypes.",
      benefits: ["Grants for PoC", "Mentor support", "Access to labs"],
      deadline: "30 Sep 2026",
      authority: "DSIR",
      region: "Central",
      businessType: "Tech",
      requiredStage: "Idea Stage",
      requirements: ["Innovative idea", "Commercial viability", "Indian entity"],
      documents: ["Concept Note", "PAN/Aadhaar", "Budget"],
      sourceType: "Government",
      websiteUrl: "https://www.dsir.gov.in/",
    },
    {
      name: "T-Fund",
      shortDescription: "Telangana startup support program",
      fullDescription:
        "T-Fund provides seed support to early-stage startups operating in Telangana across sectors.",
      benefits: ["Seed grants", "Mentorship", "Ecosystem access"],
      deadline: "15 May 2026",
      authority: "Govt of Telangana",
      region: "Telangana",
      businessType: "Tech",
      requiredStage: "Early Stage",
      requirements: ["Registered in Telangana", "Tech or tech-enabled"],
      documents: ["Registration", "Pitch Deck", "Bank Details"],
      sourceType: "Government",
      websiteUrl: "https://telangana.gov.in/",
    },
  ];
  const insert = db.prepare(`
    INSERT INTO schemes (id, name, shortDescription, fullDescription, benefits, deadline, authority, region, businessType, requiredStage, requirements, documents, sourceType, websiteUrl, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of schemes) {
    insert.run(
      randomUUID(),
      s.name,
      s.shortDescription,
      s.fullDescription,
      JSON.stringify(s.benefits),
      s.deadline,
      s.authority,
      s.region,
      s.businessType,
      s.requiredStage,
      JSON.stringify(s.requirements),
      JSON.stringify(s.documents),
      s.sourceType,
      s.websiteUrl,
      new Date().toISOString(),
    );
  }
}

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/auth/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });
  const rec = db.prepare(`SELECT * FROM logins WHERE username = ?`).get(String(username));
  if (!rec || rec.role !== "admin") return res.status(401).json({ error: "Unauthorized" });
  const hash = Buffer.from(password).toString("base64");
  if (hash !== rec.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const adminEmail = "admin@startupkeeper.local";
  const getUser = db.prepare(`SELECT * FROM users WHERE email = ?`);
  let user = getUser.get(adminEmail);
  if (!user) {
    const id = randomUUID();
    db.prepare(`INSERT INTO users (id, email, name, role, provider, createdAt) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(id, adminEmail, "ADMIN", "admin", "password", new Date().toISOString());
    user = getUser.get(adminEmail);
  }
  res.json({ user, token: "admin-token" });
});

app.post("/api/auth/register", (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email) return res.status(400).json({ error: "missing fields" });
  const exists = db.prepare(`SELECT * FROM logins WHERE username = ?`).get(String(username));
  if (exists) return res.status(409).json({ error: "username exists" });
  const hash = Buffer.from(password).toString("base64");
  db.prepare(`INSERT INTO logins (username, passwordHash, role) VALUES (?, ?, ?)`).run(String(username), hash, "entrepreneur");
  const id = randomUUID();
  db.prepare(`INSERT INTO users (id, email, name, role, provider, createdAt) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(id, String(email).toLowerCase(), String(name), "entrepreneur", "password", new Date().toISOString());
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
  res.json({ user, token: "entrepreneur-token" });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });
  const rec = db.prepare(`SELECT * FROM logins WHERE username = ?`).get(String(username));
  if (!rec) return res.status(401).json({ error: "Invalid credentials" });
  const hash = Buffer.from(password).toString("base64");
  if (hash !== rec.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const user = db.prepare(`SELECT * FROM users WHERE role = ? ORDER BY createdAt DESC`).get(rec.role);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user, token: "login-token" });
});

app.get("/api/schemes", (req, res) => {
  const { region, businessType, stage } = req.query;
  const clauses = [];
  const params = [];
  if (region && region !== "All") { clauses.push("region = ?"); params.push(String(region)); }
  if (businessType && businessType !== "All") { clauses.push("businessType = ?"); params.push(String(businessType)); }
  if (stage && stage !== "All") { clauses.push("requiredStage = ?"); params.push(String(stage)); }
  const sql = `SELECT * FROM schemes ${clauses.length ? "WHERE " + clauses.join(" AND ") : ""} ORDER BY createdAt DESC`;
  const list = db.prepare(sql).all(...params).map((r) => ({
    ...r,
    benefits: JSON.parse(r.benefits),
    requirements: JSON.parse(r.requirements),
    documents: JSON.parse(r.documents),
  }));
  res.json(list);
});

app.get("/api/schemes/:id", (req, res) => {
  const scheme = db.prepare(`SELECT * FROM schemes WHERE id = ?`).get(String(req.params.id));
  if (!scheme) return res.status(404).json({ error: "Not found" });
  res.json({
    ...scheme,
    benefits: JSON.parse(scheme.benefits),
    requirements: JSON.parse(scheme.requirements),
    documents: JSON.parse(scheme.documents),
  });
});

app.post("/api/auth/otp", async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "identifier required" });
  res.json({ success: true, message: "OTP sent" });
});

app.post("/api/auth/verify", (req, res) => {
  const { code, name, identifier, role = "student" } = req.body;
  if (code !== "123456") return res.status(401).json({ error: "Invalid OTP" });
  const email = String(identifier).includes("@") ? String(identifier).toLowerCase() : `phone-${identifier}@startupkeeper.local`;
  const getByEmail = db.prepare(`SELECT * FROM users WHERE email = ?`);
  let user = getByEmail.get(email);
  if (user) {
    db.prepare(`UPDATE users SET name = ?, role = ? WHERE email = ?`).run(name || user.name, role, email);
    user = getByEmail.get(email);
  } else {
    const id = randomUUID();
    db.prepare(`INSERT INTO users (id, email, name, role, provider, createdAt) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(id, email, name || "Founder", role, "otp", new Date().toISOString());
    user = getByEmail.get(email);
  }
  res.json({ user, token: "demo-token" });
});

app.get("/api/users/:id/applications", (req, res) => {
  const apps = db.prepare(`SELECT * FROM applications WHERE userId = ?`).all(String(req.params.id))
    .map(a => ({ ...a, interested: !!a.interested }));
  res.json(apps);
});

app.post("/api/users/:id/applications", (req, res) => {
  const { schemeId, status, date, interested = false } = req.body;
  if (!schemeId) return res.status(400).json({ error: "schemeId required" });
  const id = randomUUID();
  db.prepare(`INSERT INTO applications (id, userId, schemeId, status, date, interested, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, String(req.params.id), schemeId, status || "Not Applied", date || "", interested ? 1 : 0, new Date().toISOString());
  const appRec = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(id);
  appRec.interested = !!appRec.interested;
  res.json(appRec);
});

app.patch("/api/applications/:id", (req, res) => {
  const { status, date, interested } = req.body;
  const current = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(String(req.params.id));
  if (!current) return res.status(404).json({ error: "Not found" });
  db.prepare(`UPDATE applications SET status = ?, date = ?, interested = ? WHERE id = ?`)
    .run(status ?? current.status, date ?? current.date, typeof interested === "boolean" ? (interested ? 1 : 0) : current.interested, String(req.params.id));
  const updated = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(String(req.params.id));
  updated.interested = !!updated.interested;
  res.json(updated);
});

app.patch("/api/users/:id", (req, res) => {
  const { name, businessType, region, startupStage } = req.body;
  const current = db.prepare(`SELECT * FROM users WHERE id = ?`).get(String(req.params.id));
  if (!current) return res.status(404).json({ error: "Not found" });
  db.prepare(`UPDATE users SET name = ?, businessType = ?, region = ?, startupStage = ? WHERE id = ?`)
    .run(name ?? current.name, businessType ?? current.businessType, region ?? current.region, startupStage ?? current.startupStage, String(req.params.id));
  const updated = db.prepare(`SELECT * FROM users WHERE id = ?`).get(String(req.params.id));
  res.json(updated);
});

const PORT = process.env.PORT || 4000;
ensureSchema();
ensureSeed();
// seed admin credential if absent
const adminLogin = db.prepare(`SELECT * FROM logins WHERE username = ?`).get("ADMIN");
if (!adminLogin) {
  const defaultHash = Buffer.from("DEFAULT").toString("base64");
  db.prepare(`INSERT INTO logins (username, passwordHash, role) VALUES (?, ?, ?)`).run("ADMIN", defaultHash, "admin");
}
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
