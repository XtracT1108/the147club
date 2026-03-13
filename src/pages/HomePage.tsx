import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Ripple } from "@/components/ui/ripple";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { useTableStatus, type TableStatus } from "@/lib/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statusColors: Record<TableStatus, string> = {
  FREE: "bg-green-500/10 text-green-400 border-green-500/30",
  BUSY: "bg-red-500/10 text-red-400 border-red-500/30",
  RESERVED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

const statusBadgeVariant: Record<TableStatus, "default" | "destructive" | "outline" | "secondary"> = {
  FREE: "default",
  BUSY: "destructive",
  RESERVED: "secondary",
};

export default function HomePage() {
  const { tables, clubStatus, loading } = useTableStatus();
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      navigate("/admin");
    }
    setTimeout(() => setClickCount(0), 1500);
  };

  const sortedTables = Object.entries(tables).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-[#072b19] text-white relative overflow-hidden flex flex-col items-center">
      <DotPattern className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-10 pb-4 cursor-pointer" onClick={handleSecretClick}>
        <div className="relative w-28 h-28 mb-4">
          <img src="/147.png" alt="the147club" className="w-28 h-28 rounded-full border-2 border-[#d1aa56] shadow-lg relative z-10" />
          <Ripple className="absolute inset-0" mainCircleSize={112} mainCircleOpacity={0.15} numCircles={3} />
        </div>
        <AnimatedShinyText className="text-4xl font-extrabold tracking-tight">
          the147club
        </AnimatedShinyText>
      </header>

      {/* Club Status Banner */}
      {!loading && (
        <div className="relative z-10 mb-8">
          <AnimatedGradientText className="px-6 py-2 rounded-full text-lg font-extrabold tracking-widest uppercase">
            {clubStatus === "OPEN" ? "🟢" : "🔴"} Club is Currently {clubStatus}
          </AnimatedGradientText>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="relative z-10 flex items-center justify-center h-40">
          <div className="w-10 h-10 border-4 border-[#d1aa56]/30 border-t-[#d1aa56] rounded-full animate-spin" />
        </div>
      )}

      {/* Table Cards */}
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
                <Badge variant={statusBadgeVariant[data.status]} className="text-base px-4 py-1.5 rounded-full font-extrabold tracking-wider">
                  {data.status}
                </Badge>
                <p className="text-sm text-gray-400">
                  Last changed: {new Date(data.last_updated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map */}
      <div className="relative z-10 w-[90%] max-w-3xl mb-4 rounded-2xl overflow-hidden border border-[#d1aa56]/20 bg-[#0a3d22]/60 backdrop-blur-md p-4">
        <h3 className="text-center text-[#d1aa56] font-bold mb-3">Find Us Here</h3>
        <iframe
          src="https://maps.google.com/maps?q=26.7418749,88.388404&hl=en&z=17&output=embed"
          width="100%"
          height="250"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Social Floating Buttons */}
      <a
        href="https://www.instagram.com/the147club.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-extrabold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
        style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        Follow Us
      </a>

      <a
        href="https://wa.me/916295954071"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-extrabold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp Us
      </a>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-8 text-gray-400 text-sm mt-auto">
        <p>Live from the heart of the game.</p>
        <p>
          designed by{" "}
          <a href="https://www.instagram.com/xtract._/" target="_blank" rel="noopener noreferrer" className="text-[#d1aa56] font-extrabold tracking-wider hover:drop-shadow-[0_0_8px_rgba(209,170,86,0.5)] transition-all">
            XtracT
          </a>
        </p>
      </footer>
    </div>
  );
}
