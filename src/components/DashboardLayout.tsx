
import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import TopNavigation from "./TopNavigation";
import MobileNavigation from "./MobileNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10 flex justify-between items-center">
          <TopNavigation />
          <MobileNavigation />
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
