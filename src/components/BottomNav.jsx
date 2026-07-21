import { Link, useLocation } from "react-router-dom";

const ITEMS = [
  { to: "/echonote/home", icon: "🏠", label: "Home" },
  { to: "/echonote/me-profile", icon: "👤", label: "Profil" }
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-panel border-t border-border py-2 z-40">
      {ITEMS.map((item) => {
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 text-xs px-4 py-1 ${
              active ? "text-accent2 font-semibold" : "text-muted"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
