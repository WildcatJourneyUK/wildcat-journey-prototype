import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getUser } from "../../services/AuthProvider";
import { ProfileService, type ProfileBundle } from "../../services/ProfileService";
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function TagInput({
  label,
  values,
  setValues,
  placeholder,
}: {
  label: string;
  values: string[];
  setValues: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    setValues([...values, v]);
    setDraft("");
  }

  function remove(idx: number) {
    setValues(values.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="text-sm font-medium text-primary">{label}</label>
      <div className="mt-2 flex gap-2">
        <input
          className="w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder ?? "Type and press Add"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition"
        >
          Add
        </button>
      </div>

      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((t, idx) => (
            <button
              type="button"
              key={`${t}-${idx}`}
              onClick={() => remove(idx)}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm hover:opacity-80"
              title="Remove"
            >
              {t} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // edit mode: só aparece depois que onboarding estiver completo
  const [editMode, setEditMode] = useState(false);

  // form state (base)
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  // student form
  const [educationLevel, setEducationLevel] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [studentInterests, setStudentInterests] = useState<string[]>([]);

  // ambassador form
  const [ambMajor, setAmbMajor] = useState("");
  const [ambMinors, setAmbMinors] = useState<string[]>([]);
  const [ambInterests, setAmbInterests] = useState<string[]>([]);
  const [ambBio, setAmbBio] = useState("");
  const [ambAvailable, setAmbAvailable] = useState(true);

  // invite codes
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  const onboardingCompleted = useMemo(() => {
    if (!bundle) return false;
    if (bundle.role === "student") return bundle.student.onboarding_completed;
    if (bundle.role === "ambassador") return bundle.ambassador.onboarding_completed;
    return true; // admissions officer não tem onboarding nesse MVP
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

      // se onboarding não completou, força editMode (mostra form)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await refresh(); // recarrega bundle e troca form automaticamente
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
          onboarding_completed: completeOnboarding ? true : bundle.student.onboarding_completed,
        });
      }

      if (bundle.role === "ambassador") {
        await ProfileService.updateAmbassadorProfile(user.id, {
          major: ambMajor.trim() || null,
          minors: ambMinors,
          interests: ambInterests,
          bio: ambBio.trim() || null,
          available: ambAvailable,
          onboarding_completed: completeOnboarding ? true : bundle.ambassador.onboarding_completed,
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

  if (loading) return <Loading />
  if (!user) return <div className="mainContent p-6">No user session found.</div>;
  if (!bundle) return <div className="mainContent p-6">Could not load profile.</div>;

  return (
    <div className="mainContent flex items-start justify-center bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-3xl p-6">
        <div className="rounded-2xl border border-primary bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-primary">Profile</h1>
              <p className="mt-1 text-black/70">
                Fill in a few details so we can personalize quests, mentorship matches, and opportunities.
              </p>
            </div>

            {onboardingCompleted && bundle.role !== "admissions_officer" && (
              <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-jxl bg-red-200/50 p-3 font-semibold text-red-600">
              * {error}
            </div>
          )}

          {/* Admissions officer view */}
          {bundle.role === "admissions_officer" && (
            <div className="mt-6 space-y-3">
              <div className="text-md space-y-1">
                <p className="font-medium text-primary">
                  {bundle.base.full_name} (Admission Officer)
                </p>
                <p className="text-md text-black">
                  {user?.email}
                </p>
              </div>
              <div className="rounded-xl bg-lightBlue p-4">
                <p className="font-medium text-primary">Admissions Officer access</p>
                <p className="text-black/70">
                  This account has administrative oversight privileges. You can review ambassador content, manage quests, and curate opportunities available to students.
                </p>
              </div>
              <button onClick={() => nav("/dashboard")} className="flex items-center gap-3 rounded-xl bg-primary px-5 py-2 text-white hover:bg-secondary transition disabled:opacity-50">
                <BiArrowBack />
                Back to dashboard
              </button>
            </div>
          )}

          {/* Student/Ambassador forms */}
          {bundle.role !== "admissions_officer" && (
            <>
              {/* Completed view (read-only) */}
              {onboardingCompleted && !editMode && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {bundle.base.languages?.length ? bundle.base.languages.join(", ") : "—"}
                      </p>
                    </div>
                  </div>

                  {bundle.role === "student" && (
                    <div className="rounded-xl border border-black/10 p-4 space-y-2">
                      <p className="font-semibold text-primary">Student info</p>
                      <p><span className="text-black/60">Level:</span> {bundle.student.level}</p>
                      <p><span className="text-black/60">Education level:</span> {bundle.student.education_level ?? "—"}</p>
                      <p><span className="text-black/60">Intended major:</span> {bundle.student.intended_major ?? "—"}</p>
                      <p><span className="text-black/60">Interests:</span> {bundle.student.interests.length ? bundle.student.interests.join(", ") : "—"}</p>
                    </div>
                  )}

                  {bundle.role === "ambassador" && (
                    <div className="rounded-xl border border-black/10 p-4 space-y-2">
                      <p className="font-semibold text-primary">Ambassador info</p>
                      <p><span className="text-black/60">Major:</span> {bundle.ambassador.major ?? "—"}</p>
                      <p><span className="text-black/60">Minors:</span> {bundle.ambassador.minors.length ? bundle.ambassador.minors.join(", ") : "—"}</p>
                      <p><span className="text-black/60">Interests:</span> {bundle.ambassador.interests.length ? bundle.ambassador.interests.join(", ") : "—"}</p>
                      <p><span className="text-black/60">Available:</span> {bundle.ambassador.available ? "Yes" : "No"}</p>
                      <p className="text-black/60">Bio</p>
                      <p className="whitespace-pre-wrap">{bundle.ambassador.bio ?? "—"}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Onboarding / Edit form */}
              {(!onboardingCompleted || editMode) && (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile({ completeOnboarding: !onboardingCompleted });
                  }}
                >

                  {/* Base fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary">Full name</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Name Surname"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary">Country</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Brazil, Colombia, ..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <TagInput
                        label="Languages"
                        values={languages}
                        setValues={setLanguages}
                        placeholder="English, Portuguese, Spanish..."
                      />
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  {bundle.role === "student" && (
                    <div className="rounded-2xl border border-black/10 p-4 space-y-4">
                      <p className="font-semibold text-primary">Student onboarding</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-primary">Education level</label>
                          <input
                            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            placeholder="High school, Gap year, Transfer..."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-primary">Intended major</label>
                          <input
                            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                            value={intendedMajor}
                            onChange={(e) => setIntendedMajor(e.target.value)}
                            placeholder="Computer Science, Biology..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <TagInput
                            label="Interests"
                            values={studentInterests}
                            setValues={setStudentInterests}
                            placeholder="AI, research, entrepreneurship..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {bundle.role === "ambassador" && (
                    <div className="rounded-2xl border border-black/10 p-4 space-y-4">
                      <p className="font-semibold text-primary">Ambassador onboarding</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-primary">Major</label>
                          <input
                            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                            value={ambMajor}
                            onChange={(e) => setAmbMajor(e.target.value)}
                            placeholder="Biology, Computer Science..."
                          />
                        </div>

                        <div className="flex items-end gap-3">
                          <label className="flex items-center gap-2 text-sm text-primary">
                            <input
                              type="checkbox"
                              checked={ambAvailable}
                              onChange={(e) => setAmbAvailable(e.target.checked)}
                              className="h-4 w-4"
                            />
                            Available for mentorship
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <TagInput
                            label="Minors"
                            values={ambMinors}
                            setValues={setAmbMinors}
                            placeholder="Psychology, Data Science..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <TagInput
                            label="Interests"
                            values={ambInterests}
                            setValues={setAmbInterests}
                            placeholder="lab research, clubs, scholarships..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-primary">Short bio</label>
                          <textarea
                            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                            value={ambBio}
                            onChange={(e) => setAmbBio(e.target.value)}
                            rows={4}
                            placeholder="A short intro students will see when matched with you."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {bundle.role === "student" && (
                    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-primary">Provide Invitation Code</p>
                          <p className="text-sm text-black/70">
                            Have an invitation code? Enter your code to activate your role.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setInviteMsg(null);
                            setInviteCode("");
                            setShowInvite((v) => !v);
                          }}
                          className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                        >
                          {showInvite ? "Close" : "Invite code"}
                        </button>
                      </div>

                      {showInvite && (
                        <div className="mt-4">
                          <div className="flex gap-2">
                            <input
                              className="w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                              placeholder="Invite code"
                              value={inviteCode}
                              onChange={(e) => setInviteCode(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={redeemCode}
                              disabled={inviteBusy || !inviteCode.trim()}
                              className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition disabled:opacity-50"
                            >
                              {inviteBusy ? "Checking..." : "Apply"}
                            </button>
                          </div>

                          {inviteMsg && (
                            <div className="mt-3 rounded-xl bg-green-100 p-3 text-green-800 font-medium">
                              {inviteMsg}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {onboardingCompleted && (
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-xl bg-primary px-5 py-2 text-white hover:bg-secondary transition disabled:opacity-50"
                    >
                      {busy ? "Saving..." : onboardingCompleted ? "Save changes" : "Complete profile"}
                    </button>
                  </div>
                </form>                
              )}

              {onboardingCompleted && (
                <button onClick={() => nav("/dashboard")} className="mt-6 flex items-center gap-3 rounded-xl bg-primary px-5 py-2 text-white hover:bg-secondary transition disabled:opacity-50">
                  <BiArrowBack />
                  Back to dashboard
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}