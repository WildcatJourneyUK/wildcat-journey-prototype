import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/AuthProvider";
import { ProfileService, type Role } from "../services/ProfileService";
import Loading from "../components/Loading";

export default function DashboardRouter() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        if (!user) {
          setTarget("/auth");
          return;
        }

        const bundle = await ProfileService.getBundle(user);
        const role: Role = bundle.role;

        if (role === "student") setTarget("/student/dashboard");
        else if (role === "ambassador") setTarget("/ambassador/dashboard");
        else setTarget("/admissions/dashboard");
      } catch {
        setTarget("/auth");
      }
    })();
  }, []);

  if (!target) return <Loading/>
  return <Navigate to={target} replace />;
}