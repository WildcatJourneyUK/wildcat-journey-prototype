import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { getUser } from "../../services/AuthProvider";
import { ProfileService, type ProfileBundle } from "../../services/ProfileService";

import ProfileHeader from "./components/ProfileHeader";
import ProfileError from "./components/ProfileError";
import BackToDashboardButton from "./components/BackToDashboardButton";
import InviteCodeCard from "./components/InviteCodeCard";

import AdmissionsOfficerView from "./sections/AdmissionsOfficerView";
import BaseProfileFields from "./sections/BaseProfileFields";
import StudentProfileView from "./sections/StudentProfileView";
import AmbassadorProfileView from "./sections/AmbassadorProfileView";
import StudentOnboardingSection from "./sections/StudentOnboardingSection";
import AmbassadorOnboardingSection from "./sections/AmbassadorOnboardingSection";

export default function ProfilePage() {
  const nav = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  const [educationLevel, setEducationLevel] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [studentInterests, setStudentInterests] = useState<string[]>([]);

  const [ambMajor, setAmbMajor] = useState("");
  const [ambMinors, setAmbMinors] = useState<string[]>([]);
  const [ambInterests, setAmbInterests] = useState<string[]>([]);
  const [ambBio, setAmbBio] = useState("");
  const [ambAvailable, setAmbAvailable] = useState(true);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  const onboardingCompleted = useMemo(() => {
    if (!bundle) return false;
    if (bundle.role === "student") return bundle.student.onboarding_completed;
    if (bundle.role === "ambassador") return bundle.ambassador.onboarding_completed;
    return true;
  }, [bundle]);

  function hydrateForm(b: ProfileBundle) {
    setFullName(b.base.full_name ?? "");
    setCountry(b.base.country ?? "");
    setLanguages(b.base.languages ?? []);

    if (b.role === "student") {
      setEducationLevel(b.student.education_level ?? "");
      setIntendedMajor(b.student.intended_major ?? "");
      setStudentInterests(b.student.interests ?? []);
    }

    if (b.role === "ambassador") {
      setAmbMajor(b.ambassador.major ?? "");
      setAmbMinors(b.ambassador.minors ?? []);
      setAmbInterests(b.ambassador.interests ?? []);
      setAmbBio(b.ambassador.bio ?? "");
      setAmbAvailable(!!b.ambassador.available);
    }
  }

  async function refresh() {
    setError(null);
    setLoading(true);

    try {
      const u = await getUser();
      if (!u) {
        setUser(null);
        setBundle(null);
        return;
      }

      setUser(u);

      const b = await ProfileService.getBundle(u);
      setBundle(b);
      hydrateForm(b);

      setEditMode(!(
        (b.role === "student" && b.student.onboarding_completed) ||
        (b.role === "ambassador" && b.ambassador.onboarding_completed) ||
        b.role === "admissions_officer"
      ));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function redeemCode() {
    if (!user) return;

    setInviteMsg(null);
    setError(null);
    setInviteBusy(true);

    try {
      const newRole = await ProfileService.redeemInviteCode(user.id, inviteCode);
      setInviteMsg(`Role unlocked: ${newRole}`);
      setInviteCode("");
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to redeem code");
    } finally {
      setInviteBusy(false);
    }
  }

  async function saveProfile({ completeOnboarding }: { completeOnboarding: boolean }) {
    if (!user || !bundle) return;

    setBusy(true);
    setError(null);

    try {
      await ProfileService.updateBaseProfile(user.id, {
        full_name: fullName.trim() || null,
        country: country.trim() || null,
        languages,
      });

      if (bundle.role === "student") {
        await ProfileService.updateStudentProfile(user.id, {
          education_level: educationLevel.trim() || null,
          intended_major: intendedMajor.trim() || null,
          interests: studentInterests,
          onboarding_completed: completeOnboarding
            ? true
            : bundle.student.onboarding_completed,
        });
      }

      if (bundle.role === "ambassador") {
        await ProfileService.updateAmbassadorProfile(user.id, {
          major: ambMajor.trim() || null,
          minors: ambMinors,
          interests: ambInterests,
          bio: ambBio.trim() || null,
          available: ambAvailable,
          onboarding_completed: completeOnboarding
            ? true
            : bundle.ambassador.onboarding_completed,
        });
      }

      await refresh();
      setEditMode(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;
  if (!user) return <div className="mainContent p-6">No user session found.</div>;
  if (!bundle) return <div className="mainContent p-6">Could not load profile.</div>;

  return (
    <div className="mainContent flex items-start justify-center bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-3xl p-6">
        <div className="rounded-2xl border border-primary bg-white p-6">
          <ProfileHeader
            onboardingCompleted={onboardingCompleted}
            isAdmissionsOfficer={bundle.role === "admissions_officer"}
            editMode={editMode}
            onToggleEdit={() => setEditMode((prev) => !prev)}
          />

          <ProfileError error={error} />

          {bundle.role === "admissions_officer" && (
            <>
              <AdmissionsOfficerView bundle={bundle} user={user} />

              <InviteCodeCard
                role={bundle.role}
                showInvite={showInvite}
                setShowInvite={setShowInvite}
                inviteCode={inviteCode}
                setInviteCode={setInviteCode}
                inviteBusy={inviteBusy}
                inviteMsg={inviteMsg}
                onRedeem={redeemCode}
              />

              <BackToDashboardButton onClick={() => nav("/dashboard")} />
            </>
          )}

          {bundle.role !== "admissions_officer" && (
            <>
              {onboardingCompleted && !editMode && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-black/10 p-4">
                      <p className="text-sm text-black/60">Full name</p>
                      <p className="font-medium">{bundle.base.full_name ?? "—"}</p>
                    </div>

                    <div className="rounded-xl border border-black/10 p-4">
                      <p className="text-sm text-black/60">Country</p>
                      <p className="font-medium">{bundle.base.country ?? "—"}</p>
                    </div>

                    <div className="rounded-xl border border-black/10 p-4 md:col-span-2">
                      <p className="text-sm text-black/60">Languages</p>
                      <p className="font-medium">
                        {bundle.base.languages?.length
                          ? bundle.base.languages.join(", ")
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <StudentProfileView bundle={bundle} />
                  <AmbassadorProfileView bundle={bundle} />

                  <InviteCodeCard
                    role={bundle.role}
                    showInvite={showInvite}
                    setShowInvite={setShowInvite}
                    inviteCode={inviteCode}
                    setInviteCode={setInviteCode}
                    inviteBusy={inviteBusy}
                    inviteMsg={inviteMsg}
                    onRedeem={redeemCode}
                  />
                </div>
              )}

              {(!onboardingCompleted || editMode) && (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile({ completeOnboarding: !onboardingCompleted });
                  }}
                >
                  <BaseProfileFields
                    fullName={fullName}
                    setFullName={setFullName}
                    country={country}
                    setCountry={setCountry}
                    languages={languages}
                    setLanguages={setLanguages}
                  />

                  {bundle.role === "student" && (
                    <StudentOnboardingSection
                      educationLevel={educationLevel}
                      setEducationLevel={setEducationLevel}
                      intendedMajor={intendedMajor}
                      setIntendedMajor={setIntendedMajor}
                      studentInterests={studentInterests}
                      setStudentInterests={setStudentInterests}
                    />
                  )}

                  {bundle.role === "ambassador" && (
                    <AmbassadorOnboardingSection
                      ambMajor={ambMajor}
                      setAmbMajor={setAmbMajor}
                      ambMinors={ambMinors}
                      setAmbMinors={setAmbMinors}
                      ambInterests={ambInterests}
                      setAmbInterests={setAmbInterests}
                      ambBio={ambBio}
                      setAmbBio={setAmbBio}
                      ambAvailable={ambAvailable}
                      setAmbAvailable={setAmbAvailable}
                    />
                  )}

                  <InviteCodeCard
                    role={bundle.role}
                    showInvite={showInvite}
                    setShowInvite={setShowInvite}
                    inviteCode={inviteCode}
                    setInviteCode={setInviteCode}
                    inviteBusy={inviteBusy}
                    inviteMsg={inviteMsg}
                    onRedeem={redeemCode}
                  />

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {onboardingCompleted && (
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-xl bg-primary px-5 py-2 text-white transition hover:bg-secondary disabled:opacity-50"
                    >
                      {busy
                        ? "Saving..."
                        : onboardingCompleted
                        ? "Save changes"
                        : "Complete profile"}
                    </button>
                  </div>
                </form>
              )}

              {onboardingCompleted && (
                <BackToDashboardButton onClick={() => nav("/dashboard")} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}