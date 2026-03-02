import { useEffect, useState } from "react";
import { getUser } from "../../services/AuthProvider";
import type { User } from "@supabase/supabase-js";

export default function StudentDashboard() {
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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? "Student";

  return (
    <div className="mainContent p-6">
      <h1 className="text-3xl font-semibold">Welcome, {fullName}!</h1>
    </div>
  );
}