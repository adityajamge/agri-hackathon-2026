import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Radar",
    icon: (isActive: boolean) => (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        {isActive ? (
          <>
            <path d="M3 12a9 9 0 1 1 18 0" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
            <path d="M3 12a9 9 0 1 1 18 0" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12l5-3" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </>
        ) : (
          <>
            <path d="M3 12a9 9 0 1 1 18 0" />
            <path d="M12 12l5-3" />
            <circle cx="12" cy="12" r="1.5" />
          </>
        )}
      </svg>
    ),
  },
  {
    to: "/scan",
    label: "Scan",
    icon: (isActive: boolean) => (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        {isActive ? (
          <>
            <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          </>
        ) : (
          <>
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    ),
  },
  {
    to: "/forecast",
    label: "Forecast",
    icon: (isActive: boolean) => (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        {isActive ? (
          <>
            <path d="M5 14a4 4 0 1 1 3.5-6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
            <path d="M9 14h8a3 3 0 0 0 0-6" stroke="currentColor" strokeWidth="2" />
            <path d="M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M5 14a4 4 0 1 1 3.5-6" />
            <path d="M9 14h8a3 3 0 0 0 0-6" />
            <path d="M9 18h6" />
          </>
        )}
      </svg>
    ),
  },
  {
    to: "/community",
    label: "Community",
    icon: (isActive: boolean) => (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        {isActive ? (
          <>
            <circle cx="8" cy="9" r="2.5" fill="currentColor" />
            <circle cx="16" cy="9" r="2.5" fill="currentColor" />
            <path d="M4 19a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="2" />
            <path d="M12 19a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="2" />
          </>
        ) : (
          <>
            <circle cx="8" cy="9" r="2" />
            <circle cx="16" cy="9" r="2" />
            <path d="M4.5 17a3.5 3.5 0 0 1 7 0" />
            <path d="M12.5 17a3.5 3.5 0 0 1 7 0" />
          </>
        )}
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "My Farm",
    icon: (isActive: boolean) => (
      <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
        {isActive ? (
          <>
            <path d="M6 18v-7l6-4 6 4v7" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
            <path d="M10 18v-4h4v4" fill="currentColor" stroke="currentColor" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M6 18v-7l6-4 6 4v7" />
            <path d="M10 18v-4h4v4" />
          </>
        )}
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          data-haptic="light"
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? " is-active" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav__indicator" aria-hidden="true" />
              {item.icon(isActive)}
              <span className="bottom-nav__label">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
