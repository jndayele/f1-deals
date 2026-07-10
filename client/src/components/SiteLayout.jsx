import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col font-body selection:bg-[#E10600]/30">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}