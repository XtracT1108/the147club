import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AdminPage from "@/pages/AdminPage";
import SuperPage from "@/pages/SuperPage";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/super" element={<SuperPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
