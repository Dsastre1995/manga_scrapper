import { CreateChapterDTO } from "../../types";

export interface CreateChapterFromCommandDTO extends CreateChapterDTO {
  url: string;
}
