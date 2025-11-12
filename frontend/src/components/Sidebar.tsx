import { Home, Heart, Save, User, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Heart, label: "Liked videos", path: "/liked" },
    { icon: Save, label: "Saved videos", path: "/saved" },
  ];

  return (
    <aside className="w-56 bg-blue-50 min-h-screen p-6 fixed left-0 top-0 flex flex-col justify-between">
      <div>
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
      </div>

      {/* Bottom section (dynamic) */}
      <div className="border-t border-gray-200 mt-6 pt-4">
        {user ? (
          <div className="flex items-center justify-between">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/70 transition"
            >
              <User size={20} />
              <span>{user.name || "Profile"}</span>
            </Link>
            {/* <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button> */}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </aside>
  );
}
