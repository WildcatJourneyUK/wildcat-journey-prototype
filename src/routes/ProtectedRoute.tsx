import { Navigate } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { getSession, signOut } from "../services/AuthProvider";
import Loading from "../components/Loading";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const session = await getSession();

        if (!session) {
          await signOut();
          setAllowed(false);
        } else {
          setAllowed(true);
        }
      } catch {
        await signOut();
        setAllowed(false);
      }
    }

    check();
  }, []);

  if (allowed === null) return null; 

  if (!allowed) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export function AuthRedirect() {
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const session = await getSession();

        if (session) {
          setDestination("/dashboard");
        } else {
          setDestination("/auth");
        }
      } catch {
        setDestination("/auth");
      }
    }

    check();
  }, []);

  if (!destination) {
    return <Loading />;
  }

  return <Navigate to={destination} replace />;
}