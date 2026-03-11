import type { ProfileBundle } from "../../../services/ProfileService";

type Props = {
  bundle: ProfileBundle;
};

export default function AmbassadorProfileView({ bundle }: Props) {
  if (bundle.role !== "ambassador") return null;

  return (
    <div className="rounded-xl border border-black/10 p-4 space-y-2">
      <p className="font-semibold text-primary">Ambassador info</p>
      <p><span className="text-black/60">Major:</span> {bundle.ambassador.major ?? "—"}</p>
      <p><span className="text-black/60">Minors:</span> {bundle.ambassador.minors.length ? bundle.ambassador.minors.join(", ") : "—"}</p>
      <p><span className="text-black/60">Interests:</span> {bundle.ambassador.interests.length ? bundle.ambassador.interests.join(", ") : "—"}</p>
      <p><span className="text-black/60">Available:</span> {bundle.ambassador.available ? "Yes" : "No"}</p>
      <p className="text-black/60">Bio</p>
      <p className="whitespace-pre-wrap">{bundle.ambassador.bio ?? "—"}</p>
    </div>
  );
}