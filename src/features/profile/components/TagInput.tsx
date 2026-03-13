import { useState } from "react";

type Props = {
  label: string;
  values: string[];
  setValues: (v: string[]) => void;
  placeholder?: string;
};

export default function TagInput({
  label,
  values,
  setValues,
  placeholder,
}: Props) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value) return;
    setValues([...values, value]);
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
          className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary"
        >
          Add
        </button>
      </div>

      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value, idx) => (
            <button
              type="button"
              key={`${value}-${idx}`}
              onClick={() => remove(idx)}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm hover:opacity-80"
              title="Remove"
            >
              {value} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
}