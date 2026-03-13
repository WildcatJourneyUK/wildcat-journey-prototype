import type { User } from "@supabase/supabase-js";
import type { ProfileBundle } from "../../../services/ProfileService";

type Props = {
  bundle: ProfileBundle;
  user: User;
};

export default function AdmissionsOfficerView({ bundle, user }: Props) {
  return (
    <div className="mt-6 space-y-3">
      <div className="text-md space-y-1">
        <p className="font-medium text-primary">
          {bundle.base.full_name} (Admission Officer)
        </p>
        <p className="text-md text-black">{user.email}</p>
      </div>

      <div className="rounded-xl bg-lightBlue p-4">
        <p className="font-medium text-primary">Admissions Officer access</p>
        <p className="text-black/70">
          This account has administrative oversight privileges. You can review
          ambassador content, manage quests, and curate opportunities available
          to students.
        </p>
      </div>
    </div>
  );
}