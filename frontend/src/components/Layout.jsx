import { Link, useLocation } from "react-router-dom";
import {
   MapPin,
   BarChart3,
   Users,
   User,
   Satellite,
   Leaf,
   Mail,
   Github,
   Twitter,
   Heart,
} from "lucide-react";

const Layout = ({ children }) => {
   const location = useLocation();

   const navigation = [
      { name: "Home", href: "/", icon: MapPin },
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { name: "Platform", href: "/meadow-green", icon: Leaf },
      { name: "Community", href: "/community", icon: Users },
      { name: "Profile", href: "/profile", icon: User },
   ];

   return (
      <div
         data-theme="orbee"
         className="min-h-screen bg-gradient-to-br from-[#D9ED92] via-[#B5E48C] to-[#99D98C]"
      >
         {/* Main content */}
         <main className="mx-auto max-w-none flex-1">{children}</main>
      </div>
   );
};

export default Layout;
