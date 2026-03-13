import { FiLogOut } from "react-icons/fi";
import ukLogo from "../assets/uk-tiny-logo.svg";
import WildcatJourneyLogo from "../assets/wildcat-journey-logo.svg";
import WJTinyLogo from "../../public/wj-tiny-logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, getSession, onAuthChange } from "../services/AuthProvider";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const nav = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const notLandingPage = !["/", "/auth"].includes(window.location.pathname);

  useEffect(() => {
    getSession()
      .then((session) => setIsAuthenticated(!!session))
      .catch(() => setIsAuthenticated(false));

    const unsubscribe = onAuthChange((logged) => setIsAuthenticated(logged));
    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut();
    nav("/auth");
  }

  return (
    <header className="bg-primary text-white py-3 px-4 md:px-16">
      <div className="flex items-center justify-between">

        {/* MOBILE LOGOS */}
        <div className="md:hidden">
          {isAuthenticated ? (
            <a href="/">
              <img
                src={WJTinyLogo}
                className="h-10"
                alt="Wildcat Journey"
              />
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <a href="https://www.uky.edu/" target="_blank">
                <img src={ukLogo} className="h-10 border-r pr-5" />
              </a>
              <a href="/">
                <img src={WildcatJourneyLogo} className="h-12" />
              </a>
            </div>
          )}
        </div>

        {/* DESKTOP LOGOS */}
        <div className="hidden md:flex items-center">
          <a href="https://www.uky.edu/" target="_blank">
            <img className="h-16 border-r pr-8" src={ukLogo} />
          </a>
          <a href="/">
            <img src={WildcatJourneyLogo} className="h-24 ml-2" />
          </a>
        </div>

        {isAuthenticated && notLandingPage && (
          <div className="flex items-center gap-4 md:gap-6 text-xl md:text-2xl">
            <button
              onClick={() => nav("/profile")}
              className="hover:opacity-70 transition"
              title="Profile"
            >
              <CgProfile />
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