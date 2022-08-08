import { Chapter } from "./chapter.model";

export interface Manga {
  id: string;
  name: string;
  description: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters?: Array<Chapter>;
}

export type CreateMangaDTO = Pick<Manga, 'name' | 'description' | 'image'>;

export type MangasQueryParams = {
  name?: string;
  isActive?: string;
};