import { FiLogOut, FiUser } from "react-icons/fi";
import ukLogo from "../assets/uk-tiny-logo.svg";
import WildcatJourneyLogo from "../assets/wildcat-journey-logo.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, getSession, onAuthChange } from "../services/AuthProvider";

export default function Header() {
  const nav = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getSession()
      .then((session) => setIsAuthenticated(!!session))
      .catch(() => setIsAuthenticated(false));

    const isLoggedOut = onAuthChange((logged) => setIsAuthenticated(logged));
    return isLoggedOut;
  }, []);

  async function handleLogout() {
    await signOut();
    nav("/auth");
  }

  return (
    <header className="bg-primary text-white py-4 px-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img className="h-16 border-r pr-8" src={ukLogo} aria-hidden="true" />
          <img className="h-24 ml-2" src={WildcatJourneyLogo} aria-hidden="true" />
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-6 text-2xl">
            <button
              onClick={() => nav("/profile")}
              className="hover:opacity-70 transition"
              title="Profile"
            >
              <FiUser />
            </button>

            <button
              onClick={handleLogout}
              className="hover:opacity-70 transition"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}