// // import { NavLink } from "react-router-dom";
// // import {
// //   Home,
// //   Megaphone,
// //   Building2,
// //   Settings,
// //   User,
// //   Menu,
// //   Bell,
// //   Search,
// //   ArrowUp,
// //   ArrowDown,
// //   Activity,
// //   Plus,
// // } from "lucide-react";

// // const LeftSideNavbar = () => {
// //   return (
// //     <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 flex flex-col py-20">
// //       {/* Logo/Brand */}
// //       <div className="p-4 border-b border-gray-700 flex items-center justify-center h-16">
// //         <h1 className="text-xl font-bold">Dashboard</h1>
// //       </div>

// //       {/* Navigation Links */}
// //       <nav className="flex-1 overflow-y-auto p-4 space-y-2">
// //         <NavItem to="/admin" icon={<Home className="w-5 h-5" />} text="Home" />
// //         <NavItem
// //           to="/admin/news"
// //           icon={<Megaphone className="w-5 h-5" />}
// //           text="Announcements"
// //         />
// //         <NavItem
// //           to="/admin/company"
// //           icon={<Building2 className="w-5 h-5" />}
// //           text="Company Info"
// //         />
// //         <NavItem
// //           to="/admin/services"
// //           icon={<Settings className="w-5 h-5" />}
// //           text="Services"
// //         />
// //         <NavItem
// //           to="/admin/projects"
// //           icon={<Settings className="w-5 h-5" />}
// //           text="Projects"
// //         />
// //       </nav>

      
// //     </div>
// //   );
// // };

// // // Reusable NavItem component
// // const NavItem = ({ to, icon, text }) => {
// //   return (
// //     <NavLink
// //       to={to}
// //       className={({ isActive }) =>
// //         `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
// //           isActive
// //             ? "bg-blue-600 text-white"
// //             : "text-gray-300 hover:bg-gray-700"
// //         }`
// //       }
// //     >
// //       <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
// //       <span>{text}</span>
// //     </NavLink>
// //   );
// // };

// // export default LeftSideNavbar;

// import { NavLink } from "react-router-dom";
// import {
//   Home,
//   Megaphone,
//   Building2,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LeftSideNavbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "http://localhost:8090/api/v1/auth/logout",
//         {},
//         {
//           withCredentials: true,
//         }
//       );
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Even if API fails, clear client-side and redirect
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 flex flex-col">
//       {/* Logo/Brand */}
//       <div className="p-4 border-b border-gray-700 flex items-center justify-center h-16">
//         <h1 className="text-xl font-bold">Dashboard</h1>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 overflow-y-auto p-4 space-y-2">
//         <NavItem to="/admin" icon={<Home className="w-5 h-5" />} text="Home" />
//         <NavItem
//           to="/admin/news"
//           icon={<Megaphone className="w-5 h-5" />}
//           text="Announcements"
//         />
//         <NavItem
//           to="/admin/companyInfo"
//           icon={<Building2 className="w-5 h-5" />}
//           text="Company Info"
//         />
//         <NavItem
//           to="/admin/services"
//           icon={<Settings className="w-5 h-5" />}
//           text="Services"
//         />
//         <NavItem
//           to="/admin/projects"
//           icon={<Settings className="w-5 h-5" />}
//           text="Projects"
//         />
//       </nav>

//       {/* Logout Button */}
//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-gray-300 hover:bg-gray-700 hover:text-white"
//         >
//           <LogOut className="w-5 h-5" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Reusable NavItem component
// const NavItem = ({ to, icon, text }) => {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
//           isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
//         }`
//       }
//     >
//       <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
//       <span>{text}</span>
//     </NavLink>
//   );
// };

// export default LeftSideNavbar;
import { NavLink } from "react-router-dom";
import {
  Home,
  Megaphone,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeftSideNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8090/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, clear client-side and redirect
      navigate("/login");
    }
  };

  return (
    <div className="w-64 h-screen bg-stone-900 text-white fixed left-0 top-0 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-stone-700 flex items-center justify-center h-16">
        <h1 className="text-xl font-bold text-amber-400">Dashboard</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <NavItem to="/admin" icon={<Home className="w-5 h-5" />} text="Home" />
        <NavItem
          to="/admin/news"
          icon={<Megaphone className="w-5 h-5" />}
          text="Announcements"
        />
        <NavItem
          to="/admin/companyInfo"
          icon={<Building2 className="w-5 h-5" />}
          text="Company Info"
        />
        <NavItem
          to="/admin/services"
          icon={<Settings className="w-5 h-5" />}
          text="Services"
        />
        <NavItem
          to="/admin/projects"
          icon={<Settings className="w-5 h-5" />}
          text="Projects"
        />
        <NavItem
          to="/admin/acheivements"
          icon={<Settings className="w-5 h-5" />}
          text="Achievements"
        />
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-stone-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-stone-300 hover:bg-stone-800 hover:text-amber-400"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Reusable NavItem component
const NavItem = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive 
            ? "bg-amber-500 text-stone-900 font-medium" 
            : "text-stone-300 hover:bg-stone-800 hover:text-amber-400"
        }`
      }
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
};

export default LeftSideNavbar;