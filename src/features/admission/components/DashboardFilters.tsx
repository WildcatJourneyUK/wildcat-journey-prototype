import type { Continent } from "../admissions";

type Props = {
  continent: Continent | "All";
  region: string;
  continents: readonly (Continent | "All")[];
  regionOptions: string[];
  filteredCount: number;
  onChangeContinent: (value: Continent | "All") => void;
  onChangeRegion: (value: string) => void;
};

export default function DashboardFilters({
  continent,
  region,
  continents,
  regionOptions,
  filteredCount,
  onChangeContinent,
  onChangeRegion,
}: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:w-[280px]">
          <label className="text-sm font-medium text-primary">Continent</label>
          <select
            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
            value={continent}
            onChange={(e) => onChangeContinent(e.target.value as Continent | "All")}
          >
            {continents.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-[320px]">
          <label className="text-sm font-medium text-primary">Region</label>
          <select
            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
            value={region}
            onChange={(e) => onChangeRegion(e.target.value)}
          >
            {regionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-black/60">
          Showing <span className="font-semibold text-black">{filteredCount}</span>{" "}
          video(s)
        </div>
      </div>
    </div>
  );
}