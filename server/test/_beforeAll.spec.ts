import createManga from "../src/manga-collector/services/manga.service";
import createChapter from "../src/manga-collector/services/chapter.service";
import createPage from "../src/manga-collector/services/page.service";
import { CreateMangaDTO, Manga, CreateChapterDTO, Chapter, CreatePageDTO } from "../src/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

before(async () => {
  await prisma.$connect()
  await prisma.$queryRaw`DELETE FROM Page WHERE id IS NOT NULL`
  await prisma.$queryRaw`DELETE FROM Chapter WHERE id IS NOT NULL`
  await prisma.$queryRaw`DELETE FROM Manga WHERE id IS NOT NULL`

  const mangaToCreate: CreateMangaDTO = {
    name: "test manga",
    description: "This is a test manga"
  };

  const createdManga: Manga = await createManga(mangaToCreate);

  const chapterToCreate: CreateChapterDTO = {
    title: "This is a test chapter 1",
    chapterNumber: 1,
    mangaId: createdManga.id
  };

  const createdChapter: Chapter = await createChapter(chapterToCreate);

  const pageToCreate: CreatePageDTO = {
    pageUrl: "test.png",
    pageOrder: 1,
    chapterId: createdChapter.id
  };

  await createPage(pageToCreate);
});

after(async () => await prisma.$disconnect());