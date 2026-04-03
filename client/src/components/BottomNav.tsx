import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Radar",
    icon: (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        <path d="M3 12a9 9 0 1 1 18 0" />
        <path d="M12 12l5-3" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    to: "/scan",
    label: "Scan",
    icon: (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    to: "/forecast",
    label: "Forecast",
    icon: (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        <path d="M5 14a4 4 0 1 1 3.5-6" />
        <path d="M9 14h8a3 3 0 0 0 0-6" />
        <path d="M9 18h6" />
      </svg>
    ),
  },
  {
    to: "/community",
    label: "Community",
    icon: (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        <circle cx="8" cy="9" r="2" />
        <circle cx="16" cy="9" r="2" />
        <path d="M4.5 17a3.5 3.5 0 0 1 7 0" />
        <path d="M12.5 17a3.5 3.5 0 0 1 7 0" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "My Farm",
    icon: (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        <path d="M6 18v-7l6-4 6 4v7" />
        <path d="M10 18v-4h4v4" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? " is-active" : ""}`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
