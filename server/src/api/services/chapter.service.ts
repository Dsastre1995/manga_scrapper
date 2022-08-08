import { PrismaClient } from "@prisma/client";
import { Chapter, NotFoundError } from "../../types";
import Base from "./base.service";

class ChapterService extends Base {
  databaseClient: PrismaClient;

  constructor() {
    super();
    this.databaseClient = new PrismaClient();
  }

  async getAll(id: string): Promise<Array<Chapter>> {
    const items = await this.databaseClient.chapter.findMany({
      where: { mangaId: id }
    });
  
    if (items.length === 0) throw new NotFoundError();
  
    return items;
  }
}

export default ChapterService;