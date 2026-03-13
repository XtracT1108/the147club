import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useAuth, useTableStatus, type TableStatus, type ClubStatus } from "@/lib/hooks";

export default function AdminPage() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { tables, clubStatus, loading: tablesLoading, updateTableStatus, updateClubStatus } = useTableStatus();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) navigate("/super");
    setTimeout(() => setClickCount(0), 1500);
  };

  const handleLogin = async () => {
    setLoggingIn(true);
    setLoginError("");
    try {
      await login(email, password);
    } catch (err: unknown) {
      setLoginError("Access Denied: " + (err instanceof Error ? err.message : "Unknown error"));
      setPassword("");
    }
    setLoggingIn(false);
  };

  const handleTableUpdate = async (tableId: string, status: TableStatus) => {
    if (!user) return;
    try {
      await updateTableStatus(tableId, status, user.email || "unknown");
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const handleClubToggle = async (status: ClubStatus) => {
    if (!user) return;
    try {
      await updateClubStatus(status, user.email || "unknown");
    } catch (err) {
      console.error("Failed to update club status:", err);
    }
  };

  const sortedTables = Object.entries(tables).sort(([a], [b]) => a.localeCompare(b));

  const statusColors: Record<TableStatus, string> = {
    FREE: "bg-green-500/10 text-green-400 border-green-500/30",
    BUSY: "bg-red-500/10 text-red-400 border-red-500/30",
    RESERVED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  };

  // Login overlay
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-[#072b19] text-white flex items-center justify-center relative overflow-hidden">
        <DotPattern className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <Card className="relative z-10 bg-[#0a3d22]/80 border-[#d1aa56]/20 backdrop-blur-xl w-[90%] max-w-md">
          <BorderBeam size={100} duration={6} colorFrom="#d1aa56" colorTo="#fde08b" />
          <CardHeader className="text-center">
            <img src="/147.png" alt="logo" className="w-20 h-20 rounded-full border-2 border-[#d1aa56] mx-auto mb-4" />
            <CardTitle className="text-2xl text-[#d1aa56]">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/20 border-[#d1aa56]/30 text-white placeholder:text-gray-500" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/20 border-[#d1aa56]/30 text-white placeholder:text-gray-500" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <Button onClick={handleLogin} disabled={loggingIn} className="w-full bg-gradient-to-r from-[#d1aa56] to-[#b38f40] text-[#072b19] font-extrabold text-lg hover:shadow-lg hover:shadow-[#d1aa56]/30">
              {loggingIn ? "Verifying..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authLoading || tablesLoading) {
    return (
      <div className="min-h-screen bg-[#072b19] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#d1aa56]/30 border-t-[#d1aa56] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#072b19] text-white relative overflow-hidden flex flex-col items-center">
      <DotPattern className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-10 pb-4 cursor-pointer" onClick={handleSecretClick}>
        <img src="/147.png" alt="logo" className="w-24 h-24 rounded-full border-2 border-[#d1aa56] shadow-lg mb-3" />
        <h1 className="text-3xl font-extrabold text-red-400">the147club Admin</h1>
        <p className="text-gray-400">Control Panel</p>
        <Button variant="outline" onClick={(e) => { e.stopPropagation(); logout(); }} className="mt-3 border-[#d1aa56]/30 text-[#d1aa56] hover:bg-[#d1aa56]/10 hover:text-[#d1aa56]">
          Sign Out
        </Button>
      </header>

      {/* Global Club Status Controls */}
      <div className="relative z-10 flex flex-col items-center gap-3 mb-8">
        <h3 className="text-gray-400 font-semibold">Global Club Status</h3>
        <div className="flex gap-3">
          <Button onClick={() => handleClubToggle("OPEN")} className={`font-extrabold ${clubStatus === "OPEN" ? "bg-green-500 text-white hover:bg-green-600" : "bg-[#0a3d22] border border-[#d1aa56]/20 text-gray-400 hover:bg-[#0a3d22]/80"}`}>
            CLUB OPEN
          </Button>
          <Button onClick={() => handleClubToggle("CLOSED")} className={`font-extrabold ${clubStatus === "CLOSED" ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#0a3d22] border border-[#d1aa56]/20 text-gray-400 hover:bg-[#0a3d22]/80"}`}>
            CLUB CLOSED
          </Button>
        </div>
      </div>

      {/* Table Cards with Admin Controls */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4 mb-8">
        {sortedTables.map(([tableId, data]) => {
          const friendlyName = tableId.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
          return (
            <Card key={tableId} className={`relative bg-[#0a3d22]/80 border-[#d1aa56]/20 backdrop-blur-md overflow-hidden ${statusColors[data.status]}`}>
              <BorderBeam
                size={120}
                duration={8}
                colorFrom={data.status === "FREE" ? "#22c55e" : data.status === "BUSY" ? "#ef4444" : "#eab308"}
                colorTo={data.status === "FREE" ? "#4ade80" : data.status === "BUSY" ? "#f87171" : "#facc15"}
              />
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold text-white">{friendlyName}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <Badge className="text-base px-4 py-1.5 rounded-full font-extrabold tracking-wider">
                  {data.status}
                </Badge>
                <p className="text-sm text-gray-400">
                  Last changed: {new Date(data.last_updated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <div className="flex gap-2 mt-2">
                  {(["FREE", "BUSY", "RESERVED"] as TableStatus[]).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      onClick={() => handleTableUpdate(tableId, s)}
                      className={`font-bold ${data.status === s
                        ? s === "FREE" ? "bg-green-500 text-white" : s === "BUSY" ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
                        : "bg-[#0a3d22] border border-[#d1aa56]/20 text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {s === "RESERVED" ? "Reserve" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
