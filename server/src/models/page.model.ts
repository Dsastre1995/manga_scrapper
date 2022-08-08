export interface Page {
  id: string;
  pageUrl: string;
  pageOrder: number;
  chapterId: string;
}

export type CreatePageDTO = Omit<Page, 'id'>