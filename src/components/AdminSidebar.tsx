
import { Building2, Users, CreditCard, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, admin } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Properties", icon: Building2, path: "/properties" },
    { name: "Residents", icon: Users, path: "/residents" },
    { name: "Payments", icon: CreditCard, path: "/payments" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="font-bold text-lg text-syndicate-800">Condo Ledger</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        )}
        {collapsed && <Building2 className="mx-auto text-syndicate-600" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-syndicate-600"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1",
                location.pathname === item.path
                  ? "bg-syndicate-50 text-syndicate-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-syndicate-600"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="mb-4 px-2">
            <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
            <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
          </div>
        )}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-syndicate-600",
            collapsed ? "px-0" : ""
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
