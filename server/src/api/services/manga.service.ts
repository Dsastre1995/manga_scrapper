import { PrismaClient } from "@prisma/client";
import { Manga, MangasQueryParams, NotFoundError } from "../../types";

class MangaService {
  databaseClient: PrismaClient;

  constructor() {
    this.databaseClient = new PrismaClient();
  }

  async getAll(params: MangasQueryParams): Promise<Array<Manga>> {
    const { name, isActive } = params;
    const isTrueSet = (isActive === 'true');

    const items = await this.databaseClient.manga.findMany({
      where: {
        name: {
          contains: name
        },
        isActive: !!isActive ? isTrueSet : undefined
      }
    });

    if (items.length === 0) throw new NotFoundError()

    return items;
  }

  async getById(id: string): Promise<Manga> {
    const item = await this.databaseClient.manga.findUnique({
      where: { id },
    });
  
    if (!item) throw new NotFoundError();
  
    return item;
  }
}

export default MangaService;