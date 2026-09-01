import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  ReceiptText,
  BarChart3,
  FlaskConical,
  Sparkles,
  Activity,
  LogOut,
} from "lucide-react";

import { logout, getUser } from "../../auth/auth";

const navigation = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Risk Intelligence",
    path: "/risk",
    icon: ShieldAlert,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ReceiptText,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "What-If Simulator",
    path: "/what-if",
    icon: FlaskConical,
  },
  {
    label: "AI Advisor",
    path: "/ai-advisor",
    icon: Sparkles,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">M</div>

        <div className="brand-copy">
          <strong>Merchant</strong>
          <span>Autopilot</span>
        </div>
      </div>

      <div className="merchant-mini">
        <div className="merchant-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <strong>
            {user?.name || "Merchant"}
          </strong>

          <span>Merchant account</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-heading">WORKSPACE</p>

        {navigation.map(
          ({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon
                size={18}
                strokeWidth={1.9}
              />

              <span>{label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />

        <button
          type="button"
          className="nav-item sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>

        <div className="system-status">
          <span className="status-dot" />

          <div>
            <strong>
              {user?.name || "Merchant"}
            </strong>

            <span>Account secured</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;