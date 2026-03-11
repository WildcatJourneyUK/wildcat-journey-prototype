export type Continent =
  | "North America"
  | "South America"
  | "Europe"
  | "Africa"
  | "Asia"
  | "Oceania";

export type VideoItem = {
  id: string;
  title: string;
  youtubeId: string;
  continent: Continent;
  region: string;
  language: string;
  tags?: string[];
};