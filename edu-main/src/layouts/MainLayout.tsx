import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import BottomTabs from "../components/BottomTabs";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden app-bg">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop/tablet top bar */}
        <TopBar />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
          role="main"
        >
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomTabs />
    </div>
  );
}
