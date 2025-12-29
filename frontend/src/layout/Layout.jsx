// src/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import Navbar from "../components/navbar/Navbar.jsx";
import "./layout.scss";

export default function Layout() {
  // Persist collapsed state (desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "1";
  });

  // Mobile drawer open/close
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();

  // Save collapsed state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed ? "1" : "0");
  }, [isCollapsed]);

  // Close mobile drawer on route change (so it doesn't stay open after clicking a nav item)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className={`appLayout ${
        isCollapsed ? "sidebarCollapsed" : "sidebarExpanded"
      } ${isMobileOpen ? "mobileSidebarOpen" : ""}`}
    >
      {/* Dark overlay on phone when sidebar is open */}
      <div className="scrim" onClick={() => setIsMobileOpen(false)} />

      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="contentArea">
        <Navbar onOpenMobileSidebar={() => setIsMobileOpen(true)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
