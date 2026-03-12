import { FiEye, FiEyeOff } from "react-icons/fi";

type PasswordInputProps = {
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisible: () => void;
};

export default function PasswordInput({
  label,
  value,
  placeholder,
  visible,
  onChange,
  onToggleVisible,
}: PasswordInputProps) {
  return (
    <div>
      <label className="text-sm text-primary sm:text-base">{label}</label>

      <div className="relative">
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2 pr-10 text-sm sm:text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          minLength={6}
          required
        />

        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}