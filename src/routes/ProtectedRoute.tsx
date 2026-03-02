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

export function LogoutAndRedirect() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await signOut();
        setDone(true);
      } catch {
        console.error("Sign out error.")
      }
    })();
  }, []);

  if (!done) {
    return <Loading />; 
  }

  return <Navigate to="/auth" replace />;
}