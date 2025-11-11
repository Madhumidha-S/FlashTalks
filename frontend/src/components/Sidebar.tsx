import { Home, Heart, Save, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Heart, label: "Liked videos", path: "/liked" },
    { icon: Save, label: "Saved videos", path: "/saved" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="w-56 bg-blue-50 min-h-screen p-6 fixed left-0 top-0">
      <Link to="/" className="text-2xl font-bold text-black mb-12 block">
        FlashTalks
      </Link>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-white text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-white/50"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
