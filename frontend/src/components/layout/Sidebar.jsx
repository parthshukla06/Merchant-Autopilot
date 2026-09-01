import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  ReceiptText,
  BarChart3,
  FlaskConical,
  Sparkles,
  Settings,
  Activity,
} from "lucide-react";

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
        <div className="merchant-avatar">U</div>

        <div>
          <strong>UrbanCart India</strong>
          <span>Merchant account</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-heading">WORKSPACE</p>

        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />

        <NavLink
          to="/settings"
          className="nav-item"
          onClick={(event) => event.preventDefault()}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <div className="system-status">
          <span className="status-dot" />

          <div>
            <strong>System Online</strong>

            <span>
              <Activity size={12} />
              All services operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;