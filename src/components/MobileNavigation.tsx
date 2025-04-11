
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileNavigation = () => {
  const navigate = useNavigate();
  
  return (
    <Menubar className="md:hidden border-none">
      <MenubarMenu>
        <MenubarTrigger>
          <Menu className="h-5 w-5" />
          <span className="ml-2">Menu</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate("/dashboard")}>Dashboard</MenubarItem>
          <MenubarItem onClick={() => navigate("/properties")}>Properties</MenubarItem>
          <MenubarItem onClick={() => navigate("/residents")}>Residents</MenubarItem>
          <MenubarItem onClick={() => navigate("/payments")}>Payments</MenubarItem>
          <MenubarItem onClick={() => navigate("/charges")}>Charges</MenubarItem>
          <MenubarItem onClick={() => navigate("/settings")}>Settings</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MobileNavigation;
