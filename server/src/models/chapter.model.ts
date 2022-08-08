import { Page } from "./page.model";

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  mangaId: string;
  pages?: Array<Page>
}

export type CreateChapterDTO = Omit<Chapter, 'id' | 'pages'>;