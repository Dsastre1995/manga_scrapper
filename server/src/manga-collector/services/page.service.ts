import { PrismaClient } from "@prisma/client";
import { CreatePageDTO, Page } from "../../types";

const dbClient = new PrismaClient();

const createPage = async (page: CreatePageDTO): Promise<Page> => {
  const { pageUrl, pageOrder, chapterId } = page;
  const createdPage = dbClient.page.create({ data: {
    pageUrl,
    pageOrder,
    chapterId
  } });

  if (!createdPage) throw new Error();

  return createdPage;
};

export default createPage;