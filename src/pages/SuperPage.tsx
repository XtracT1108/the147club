import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useAuth, useAuditLogs, useUserRole, createAdminAccount } from "@/lib/hooks";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Secondary Firebase app for creating accounts without logging out the superuser
const secondaryApp = initializeApp(
  {
    projectId: "the147club-hq",
    appId: "1:482179632538:web:821c650ad79097eb89fe23",
    storageBucket: "the147club-hq.firebasestorage.app",
    apiKey: "AIzaSyCvEkZzZ84CjTRoOaOgBxPg8Ayt0tfST-A",
    authDomain: "the147club-hq.firebaseapp.com",
    messagingSenderId: "482179632538",
  },
  "secondary"
);
const secondaryAuth = getAuth(secondaryApp);

export default function SuperPage() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.email);
  const { logs, loading: logsLoading } = useAuditLogs();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin creation
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [createMsg, setCreateMsg] = useState("");

  const handleLogin = async () => {
    setLoggingIn(true);
    setLoginError("");
    try {
      await login(email.toLowerCase(), password);
    } catch (err: unknown) {
      setLoginError("Access Denied: " + (err instanceof Error ? err.message : "Unknown error"));
      setPassword("");
    }
    setLoggingIn(false);
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminPass) return;
    setCreateMsg("Creating...");
    try {
      await createUserWithEmailAndPassword(secondaryAuth, newAdminEmail, newAdminPass);
      await secondaryAuth.signOut();
      await createAdminAccount(newAdminEmail);
      setCreateMsg(`✅ Admin account created for ${newAdminEmail}`);
      setNewAdminEmail("");
      setNewAdminPass("");
    } catch (err: unknown) {
      setCreateMsg("❌ " + (err instanceof Error ? err.message : "Failed"));
    }
  };

  // Login overlay
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-[#072b19] text-white flex items-center justify-center relative overflow-hidden">
        <DotPattern className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <Card className="relative z-10 bg-[#0a3d22]/80 border-[#d1aa56]/20 backdrop-blur-xl w-[90%] max-w-md">
          <BorderBeam size={100} duration={6} colorFrom="#fbbf24" colorTo="#f59e0b" />
          <CardHeader className="text-center">
            <img src="/147.png" alt="logo" className="w-20 h-20 rounded-full border-2 border-[#d1aa56] mx-auto mb-4" />
            <CardTitle className="text-2xl text-amber-400">Master Console</CardTitle>
            <p className="text-amber-400/60 text-sm">Superuser Access Only</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Superuser Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/20 border-amber-400/30 text-white placeholder:text-gray-500" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/20 border-amber-400/30 text-white placeholder:text-gray-500" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <Button onClick={handleLogin} disabled={loggingIn} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#072b19] font-extrabold text-lg">
              {loggingIn ? "Verifying..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#072b19] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Access denied if not SUPERUSER
  if (role !== "SUPERUSER") {
    return (
      <div className="min-h-screen bg-[#072b19] text-white flex items-center justify-center">
        <Card className="bg-[#0a3d22]/80 border-red-500/30 w-[90%] max-w-md text-center p-8">
          <p className="text-red-400 text-xl font-bold">⚠️ Access Denied</p>
          <p className="text-gray-400 mt-2">This account does not have Superuser privileges.</p>
          <Button onClick={logout} variant="outline" className="mt-4 border-red-500/30 text-red-400">
            Sign Out
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#072b19] text-white relative overflow-hidden flex flex-col items-center">
      <DotPattern className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-10 pb-4">
        <img src="/147.png" alt="logo" className="w-24 h-24 rounded-full border-2 border-amber-400 shadow-lg mb-3" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Master Console</h1>
        <p className="text-amber-400/60">Superuser Access Only</p>
        <Button variant="outline" onClick={logout} className="mt-3 border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-400">
          Sign Out
        </Button>
      </header>

      {/* Create Admin */}
      <Card className="relative z-10 bg-[#0a3d22]/80 border-amber-400/20 w-[90%] max-w-2xl mb-6">
        <CardHeader>
          <CardTitle className="text-amber-400">Create Admin Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="New admin email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="bg-black/20 border-amber-400/30 text-white placeholder:text-gray-500" />
          <Input placeholder="New admin password" type="password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} className="bg-black/20 border-amber-400/30 text-white placeholder:text-gray-500" />
          <Button onClick={handleCreateAdmin} className="bg-gradient-to-r from-amber-400 to-amber-600 text-[#072b19] font-extrabold">
            Create Admin
          </Button>
          {createMsg && <p className="text-sm text-gray-300">{createMsg}</p>}
        </CardContent>
      </Card>

      <Separator className="w-[90%] max-w-2xl bg-amber-400/20 mb-6 relative z-10" />

      {/* Audit Logs */}
      <Card className="relative z-10 bg-[#0a3d22]/80 border-amber-400/20 w-[90%] max-w-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-amber-400">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <p className="text-gray-400">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-400">No audit logs yet.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-black/20 border border-amber-400/10">
                  <div>
                    <p className="text-sm text-white font-semibold">{log.action}</p>
                    <p className="text-xs text-gray-500">by {log.adminEmail}</p>
                  </div>
                  <p className="text-xs text-amber-400/60 mt-1 sm:mt-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
