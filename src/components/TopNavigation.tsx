
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const TopNavigation = () => {
  const location = useLocation();
  
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/dashboard">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/dashboard" && "bg-accent text-accent-foreground"
              )}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/properties">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/properties" && "bg-accent text-accent-foreground"
              )}
            >
              Properties
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/residents">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/residents" && "bg-accent text-accent-foreground"
              )}
            >
              Residents
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/payments">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/payments" && "bg-accent text-accent-foreground"
              )}
            >
              Payments
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/charges">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/charges" && "bg-accent text-accent-foreground"
              )}
            >
              Charges
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNavigation;
