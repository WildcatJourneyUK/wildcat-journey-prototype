import { STUDENT_LEVELS, type StudentLevel } from "./student";

export function levelLabel(level: StudentLevel) {
  if (level === "explorer") return "Explorer";
  if (level === "applicant") return "Applicant";
  if (level === "admitted") return "Admitted";
  return "Current Wildcat";
}

export function percent(done: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

export function normalizeStudentLevel(value: unknown): StudentLevel {
  const v = String(value ?? "");
  if (
    v === "explorer" ||
    v === "applicant" ||
    v === "admitted" ||
    v === "current_wildcat"
  ) {
    return v;
  }
  return "explorer";
}

export function levelIndex(level: StudentLevel) {
  return STUDENT_LEVELS.indexOf(level);
}