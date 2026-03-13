import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, onSnapshot, updateDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { auth, db } from "./firebase";

// ─── Auth Hook ───
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, login, logout };
}

// ─── Table Status Types ───
export type TableStatus = "FREE" | "BUSY" | "RESERVED";
export type ClubStatus = "OPEN" | "CLOSED";

export interface TableData {
  status: TableStatus;
  last_updated: string;
}

export interface TablesState {
  club_status: ClubStatus;
  [key: string]: TableData | ClubStatus;
}

// ─── Table Status Hook ───
export function useTableStatus() {
  const [tables, setTables] = useState<Record<string, TableData>>({});
  const [clubStatus, setClubStatus] = useState<ClubStatus>("OPEN");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tablesDocRef = doc(db, "tables", "state");
    const unsub = onSnapshot(
      tablesDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as TablesState;
          setClubStatus((data.club_status as ClubStatus) || "OPEN");

          // Filter out club_status, keep only table entries
          const tableEntries: Record<string, TableData> = {};
          for (const [key, value] of Object.entries(data)) {
            if (key !== "club_status" && typeof value === "object" && value !== null) {
              tableEntries[key] = value as TableData;
            }
          }
          setTables(tableEntries);
        } else {
          // Seed default data
          await setDoc(tablesDocRef, {
            club_status: "OPEN",
            table_1: { status: "FREE", last_updated: new Date().toISOString() },
            table_2: { status: "FREE", last_updated: new Date().toISOString() },
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error connecting to real-time database:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const updateTableStatus = async (tableId: string, status: TableStatus, userEmail: string) => {
    const tablesDocRef = doc(db, "tables", "state");
    await updateDoc(tablesDocRef, {
      [`${tableId}.status`]: status,
      [`${tableId}.last_updated`]: new Date().toISOString(),
    });
    await addDoc(collection(db, "audit_logs"), {
      adminEmail: userEmail,
      action: `Changed ${tableId.replace("_", " ")} to ${status}`,
      timestamp: new Date().toISOString(),
    });
  };

  const updateClubStatus = async (status: ClubStatus, userEmail: string) => {
    const tablesDocRef = doc(db, "tables", "state");
    await updateDoc(tablesDocRef, { club_status: status });
    await addDoc(collection(db, "audit_logs"), {
      adminEmail: userEmail,
      action: `Changed Club Status to ${status}`,
      timestamp: new Date().toISOString(),
    });
  };

  return { tables, clubStatus, loading, updateTableStatus, updateClubStatus };
}

// ─── Audit Logs Hook ───
export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  timestamp: string;
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(50));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const logData: AuditLog[] = [];
        snapshot.forEach((doc) => {
          logData.push({ id: doc.id, ...doc.data() } as AuditLog);
        });
        setLogs(logData);
        setLoading(false);
      },
      (err) => {
        console.error("Audit logs query error:", err);
        // Fallback: try without orderBy (index may not exist)
        const fallbackUnsub = onSnapshot(collection(db, "audit_logs"), (snapshot) => {
          const logData: AuditLog[] = [];
          snapshot.forEach((doc) => {
            logData.push({ id: doc.id, ...doc.data() } as AuditLog);
          });
          logData.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          setLogs(logData);
          setLoading(false);
        });
        return fallbackUnsub;
      }
    );
    return unsub;
  }, []);

  return { logs, loading };
}

// ─── User Role Hook ───
export function useUserRole(email: string | null | undefined) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setRole(null);
      setLoading(false);
      return;
    }
    const userDocRef = doc(db, "users", email.toLowerCase());
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setRole(docSnap.data().role || null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [email]);

  return { role, loading };
}

// ─── Create Admin Account (for Superuser) ───
export async function createAdminAccount(email: string) {
  // This creates a Firestore user document with ADMIN role
  const userDocRef = doc(db, "users", email.toLowerCase());
  await setDoc(userDocRef, { role: "ADMIN" });
}

export async function getAdminList() {
  const q = query(collection(db, "users"));
  const snapshot = await getDocs(q);
  const admins: { email: string; role: string }[] = [];
  snapshot.forEach((doc) => {
    admins.push({ email: doc.id, role: doc.data().role });
  });
  return admins;
}
