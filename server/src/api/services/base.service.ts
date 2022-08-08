import { PrismaClient } from "@prisma/client";
import { Chapter, Page } from "../../types";

abstract class Base {
  abstract databaseClient: PrismaClient;

  abstract getAll(id?: string): Promise<Array<Chapter | Page>>
}

export default Base;