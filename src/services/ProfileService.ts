import type { User } from "@supabase/supabase-js";
import { supabase } from "./SupabaseClient";

export type Role = "student" | "ambassador" | "admissions_officer";
export type StudentLevel = "explorer" | "applicant" | "admitted" | "current_wildcat";
type UpdatePayload<T> = Partial<T>;

export type BaseProfile = {
  id: string;
  full_name: string | null;
  role: Role;
  country: string | null;
  languages: string[];
};

export type StudentProfile = {
  id: string;
  level: StudentLevel;
  education_level: string | null;
  intended_major: string | null;
  interests: string[];
  onboarding_completed: boolean;
  xp: number;
};

export type AmbassadorProfile = {
  id: string;
  major: string | null;
  minors: string[];
  interests: string[];
  bio: string | null;
  available: boolean;
  onboarding_completed: boolean;
};

export type ProfileBundle =
  | { base: BaseProfile; role: "student"; student: StudentProfile; ambassador: null }
  | { base: BaseProfile; role: "ambassador"; student: null; ambassador: AmbassadorProfile }
  | { base: BaseProfile; role: "admissions_officer"; student: null; ambassador: null };

function normalizeArray(values: string[]) {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((v, idx, arr) => arr.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === idx);
}

function toRole(value: unknown): Role {
  if (value === "ambassador" || value === "admissions_officer") return value;
  return "student";
}

export class ProfileService {
  static async ensureProfileExists(user: User): Promise<BaseProfile> {
    // try read base profile
    const { data: existing, error: readErr } = await supabase
      .from("profiles")
      .select("id, full_name, role, country, languages")
      .eq("id", user.id)
      .maybeSingle();

    if (readErr) throw readErr;

    const fullNameFromAuth =
      (user.user_metadata?.full_name as string | undefined) ?? null;

    if (!existing) {
      const insertPayload = {
        id: user.id,
        full_name: fullNameFromAuth,
        role: "student" as Role,
        country: null,
        languages: [] as string[],
      };

      const { data: created, error: insErr } = await supabase
        .from("profiles")
        .insert(insertPayload)
        .select("id, full_name, role, country, languages")
        .single();

      if (insErr) throw insErr;

      // create role-specific row (student default)
      await this.ensureRoleRowExists(user.id, "student");

      return {
        id: created.id,
        full_name: created.full_name,
        role: toRole(created.role),
        country: created.country,
        languages: created.languages ?? [],
      };
    }

    // if exists, ensure role row exists
    const role = toRole(existing.role);
    await this.ensureRoleRowExists(user.id, role);

    return {
      id: existing.id,
      full_name: existing.full_name,
      role,
      country: existing.country,
      languages: existing.languages ?? [],
    };
  }

  static async ensureRoleRowExists(userId: string, role: Role) {
    if (role === "student") {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;

      if (!data) {
        const { error: insErr } = await supabase.from("student_profiles").insert({
          id: userId,
          level: "explorer",
          onboarding_completed: false,
          interests: [],
          xp: 0,
        });
        if (insErr) throw insErr;
      }
    }

    if (role === "ambassador") {
      const { data, error } = await supabase
        .from("ambassador_profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;

      if (!data) {
        const { error: insErr } = await supabase.from("ambassador_profiles").insert({
          id: userId,
          onboarding_completed: false,
          minors: [],
          interests: [],
          available: true,
        });
        if (insErr) throw insErr;
      }
    }

    // admissions_officer: no extra table needed for MVP
  }

  static async getBundle(user: User): Promise<ProfileBundle> {
    const base = await this.ensureProfileExists(user);

    if (base.role === "student") {
      const { data, error } = await supabase
        .from("student_profiles")
        .select(
          "id, level, education_level, intended_major, interests, onboarding_completed, xp"
        )
        .eq("id", user.id)
        .single();
      if (error) throw error;

      return {
        base,
        role: "student",
        student: {
          ...data,
          interests: data.interests ?? [],
        },
        ambassador: null,
      };
    }

    if (base.role === "ambassador") {
      const { data, error } = await supabase
        .from("ambassador_profiles")
        .select("id, major, minors, interests, bio, available, onboarding_completed")
        .eq("id", user.id)
        .single();
      if (error) throw error;

      return {
        base,
        role: "ambassador",
        student: null,
        ambassador: {
          ...data,
          minors: data.minors ?? [],
          interests: data.interests ?? [],
        },
      };
    }

    return { base, role: "admissions_officer", student: null, ambassador: null };
  }

  static async updateBaseProfile(
    userId: string,
    input: Partial<Pick<BaseProfile, "full_name" | "country" | "languages">>
  ) {
    const payload: UpdatePayload<BaseProfile> = {};
    if (typeof input.full_name !== "undefined") payload.full_name = input.full_name;
    if (typeof input.country !== "undefined") payload.country = input.country;
    if (typeof input.languages !== "undefined") payload.languages = normalizeArray(input.languages);

    const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
    if (error) throw error;
  }

  static async updateStudentProfile(
    userId: string,
    input: Partial<Pick<StudentProfile, "education_level" | "intended_major" | "interests" | "onboarding_completed" | "level">>
  ) {
    const payload: UpdatePayload<StudentProfile> = {};
    if (typeof input.education_level !== "undefined") payload.education_level = input.education_level;
    if (typeof input.intended_major !== "undefined") payload.intended_major = input.intended_major;
    if (typeof input.level !== "undefined") payload.level = input.level;
    if (typeof input.onboarding_completed !== "undefined") payload.onboarding_completed = input.onboarding_completed;
    if (typeof input.interests !== "undefined") payload.interests = normalizeArray(input.interests);

    const { error } = await supabase.from("student_profiles").update(payload).eq("id", userId);
    if (error) throw error;
  }

  static async updateAmbassadorProfile(
    userId: string,
    input: Partial<Pick<AmbassadorProfile, "major" | "minors" | "interests" | "bio" | "available" | "onboarding_completed">>
  ) {
    const payload: UpdatePayload<AmbassadorProfile> = {};
    if (typeof input.major !== "undefined") payload.major = input.major;
    if (typeof input.bio !== "undefined") payload.bio = input.bio;
    if (typeof input.available !== "undefined") payload.available = input.available;
    if (typeof input.onboarding_completed !== "undefined") payload.onboarding_completed = input.onboarding_completed;
    if (typeof input.minors !== "undefined") payload.minors = normalizeArray(input.minors);
    if (typeof input.interests !== "undefined") payload.interests = normalizeArray(input.interests);

    const { error } = await supabase.from("ambassador_profiles").update(payload).eq("id", userId);
    if (error) throw error;
  }

  static async redeemInviteCode(userId: string, codeRaw: string) {
    const code = codeRaw.trim();

    if (!code) throw new Error("Please enter an invite code.");

    const { data: invite, error: readErr } = await supabase
      .from("role_invites")
      .select("code, role, max_uses, uses, expires_at")
      .eq("code", code)
      .single();

    if (readErr) throw readErr;

    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
      throw new Error("This invite code has expired.");
    }

    if (invite.uses >= invite.max_uses) {
      throw new Error("This invite code has already been used.");
    }

    const newRole = toRole(invite.role);

    if (
      newRole !== "student" &&
      newRole !== "ambassador" &&
      newRole !== "admissions_officer"
    ) {
      throw new Error("Invalid role for this code.");
    }

    const { error: updInviteErr } = await supabase
      .from("role_invites")
      .update({ uses: invite.uses + 1 })
      .eq("code", code);

    if (updInviteErr) throw updInviteErr;

    const { error: updProfileErr } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (updProfileErr) throw updProfileErr;

    await this.ensureRoleRowExists(userId, newRole);

    return newRole;
  }
}

