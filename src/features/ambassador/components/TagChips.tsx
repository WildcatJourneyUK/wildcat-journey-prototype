type Props = {
  items: string[];
};

export default function TagChips({ items }: Props) {
  if (!items.length) return <span className="text-black/50">—</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  );
}