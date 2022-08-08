import { PrismaClient } from "@prisma/client";
import { CreateMangaDTO, Manga } from "../../types";

const dbClient = new PrismaClient();

async function createManga(manga: CreateMangaDTO): Promise<Manga> {
  const { name, description, image = 'test.png' } = manga;
  const createdManga = await dbClient.manga.create({ data: {
    name,
    description,
    image
  } });

  if (!createdManga) throw new Error();

  return createdManga;
}

export default createManga;