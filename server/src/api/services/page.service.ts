import Base from "./base.service";
import { PrismaClient } from "@prisma/client";
import { Page, NotFoundError } from "../../types";

class PageService extends Base {
  databaseClient: PrismaClient;

  constructor() {
    super();
    this.databaseClient = new PrismaClient();
  }

  async getAll(id: string): Promise<Array<Page>> {
    const items = await this.databaseClient.page.findMany({
      where: { chapterId: id }
    });
  
    if (items.length === 0) throw new NotFoundError();
  
    return items;
  }
}

export default PageService;