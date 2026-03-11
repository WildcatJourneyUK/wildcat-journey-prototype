import type { ProfileBundle } from "../../../services/ProfileService";

type Props = {
  bundle: ProfileBundle;
};

export default function StudentProfileView({ bundle }: Props) {
  if (bundle.role !== "student") return null;

  return (
    <div className="rounded-xl border border-black/10 p-4 space-y-2">
      <p className="font-semibold text-primary">Student info</p>
      <p><span className="text-black/60">Level:</span> {bundle.student.level}</p>
      <p><span className="text-black/60">Education level:</span> {bundle.student.education_level ?? "—"}</p>
      <p><span className="text-black/60">Intended major:</span> {bundle.student.intended_major ?? "—"}</p>
      <p><span className="text-black/60">Interests:</span> {bundle.student.interests.length ? bundle.student.interests.join(", ") : "—"}</p>
    </div>
  );
}