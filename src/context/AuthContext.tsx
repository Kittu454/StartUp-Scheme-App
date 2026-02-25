import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "student" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: "password" | "google";
  role: UserRole;
  startupStage?: string;
  businessType?: string;
  region?: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  startupStage?: string;
  businessType?: string;
  region?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  users: StoredUser[];
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: {
    name: string;
    businessType: string;
    region: string;
    startupStage: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "startup-keeper-auth-user";
const USERS_KEY = "startup-keeper-users";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }

    try {
      const storedUsers = window.localStorage.getItem(USERS_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch {
      setUsers([]);
    }

    setLoading(false);
  }, []);

  const persistUser = (next: AuthUser | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const persistUsers = (next: StoredUser[]) => {
    setUsers(next);
    window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
  };

  const upsertUser = (partial: Omit<StoredUser, "role"> & { role?: UserRole }): StoredUser => {
    const existing = users.find((u) => u.email.toLowerCase() === partial.email.toLowerCase());
    const role: UserRole = partial.role ?? existing?.role ?? "student";
    const base: StoredUser = {
      id: partial.id,
      name: partial.name,
      email: partial.email.toLowerCase(),
      startupStage: partial.startupStage ?? existing?.startupStage ?? "Early Stage",
      businessType: partial.businessType ?? existing?.businessType ?? "Tech",
      region: partial.region ?? existing?.region ?? "Telangana",
      role,
    };
    const nextUsers = existing
      ? users.map((u) => (u.email.toLowerCase() === base.email ? base : u))
      : [...users, base];
    persistUsers(nextUsers);
    return base;
  };

  const loginWithEmail = async (email: string, _password: string) => {
    const normalizedEmail = email.toLowerCase();
    const isSeedAdmin = normalizedEmail === "admin@startupkeeper.local";

    const stored = users.find((u) => u.email === normalizedEmail);
    const storedRole: UserRole | undefined = stored?.role;

    const storedUser = upsertUser({
      id: stored?.id ?? `local-${normalizedEmail}`,
      name: stored?.name ?? (email.split("@")[0] || "Founder"),
      email: normalizedEmail,
      startupStage: stored?.startupStage ?? "Early Stage",
      businessType: stored?.businessType ?? "Tech",
      region: stored?.region ?? "Telangana",
      role: storedRole ?? (isSeedAdmin ? "admin" : "student"),
    });

    const authUser: AuthUser = {
      ...storedUser,
      provider: "password",
    };

    persistUser(authUser);
  };

  const loginWithGoogle = async () => {
    const email = "founder@example.com";
    const normalizedEmail = email.toLowerCase();

    const stored = users.find((u) => u.email === normalizedEmail);
    const storedUser = upsertUser({
      id: stored?.id ?? "google-demo-user",
      name: stored?.name ?? "Google Founder",
      email: normalizedEmail,
      startupStage: stored?.startupStage ?? "Early Stage",
      businessType: stored?.businessType ?? "Tech",
      region: stored?.region ?? "Karnataka",
      role: stored?.role ?? "admin", // treat demo Google account as admin
    });

    const authUser: AuthUser = {
      ...storedUser,
      provider: "google",
    };

    persistUser(authUser);
  };

  const logout = () => {
    persistUser(null);
  };

  const updateProfile: AuthContextValue["updateProfile"] = (data) => {
    if (!user) return;

    const updatedStored: StoredUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: data.name,
      businessType: data.businessType,
      region: data.region,
      startupStage: data.startupStage,
    };

    const nextUsers = users.some((u) => u.id === updatedStored.id)
      ? users.map((u) => (u.id === updatedStored.id ? updatedStored : u))
      : [...users, updatedStored];

    persistUsers(nextUsers);

    const updatedAuthUser: AuthUser = {
      ...user,
      name: data.name,
      businessType: data.businessType,
      region: data.region,
      startupStage: data.startupStage,
    };

    persistUser(updatedAuthUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, users, loginWithEmail, loginWithGoogle, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
