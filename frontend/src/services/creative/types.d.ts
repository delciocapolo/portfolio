export interface IArtwork {
  id: string;
  height: number;
  legend: string;
  category: string;
  location: string;
  isVideo?: boolean;
}

export interface IArtworkCategory {
  slug: string;
  title: string;
}
