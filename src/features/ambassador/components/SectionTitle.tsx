type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      {subtitle ? <p className="text-sm text-black/70">{subtitle}</p> : null}
    </div>
  );
}