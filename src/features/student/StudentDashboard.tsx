import { useEffect, useState } from "react";
import { getUser } from "../../services/AuthProvider";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import Loading from "../../components/Loading";

export default function StudentDashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getUser();
        setUser(u);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Something went wrong";
        console.error(message)
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />
  if (!user) return <div className="mainContent">No user found</div>;

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? "Student";

  return (
    <div className="mainContent p-6">
      <h1 className="text-3xl font-semibold">Welcome, {fullName}!</h1>
       {(
          <div className="rounded-2xl flex justify-between items-center mt-6 bg-lightBlue p-4 text-primary">
            <p className="font-semibold">Complete your profile to unlock your personalized journey!</p>
            <button className="bg-primary flex items-center gap-6 text-white px-16 py-3 rounded-2xl" onClick={() => nav("/profile")}>
              Go to Profile
              <CgProfile size={28}/>
            </button>
          </div>
        )}
    </div>
  );
}