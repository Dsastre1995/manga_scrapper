import { PrismaClient } from "@prisma/client";
import { Chapter, CreateChapterDTO } from "../../types";

const dbClient = new PrismaClient();

async function createChapter(chapter: CreateChapterDTO): Promise<Chapter> {
  const { title, chapterNumber, mangaId } = chapter;
  const createdChapter = await dbClient.chapter.create({ data: {
    title,
    chapterNumber,
    mangaId
  } });

  if (!createdChapter) throw new Error();

  return createdChapter;
};

export default createChapter;