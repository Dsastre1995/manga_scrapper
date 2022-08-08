import { strictEqual } from "assert";
import request from "supertest"
import app from "../src/api/app"
import { Chapter } from "../src/types"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
let chapter: Chapter;

before(async () => {
  const result: Array<Chapter> = await prisma.$queryRaw<Chapter[]>`SELECT * FROM Chapter LIMIT 1`;
  chapter = result[0]
});

describe('Page API', () => {
  it('Should return 200 when requesting page by chapter ID', async () => {
    const pageReq = await request(app).get(`/page/${chapter.id}`);
    strictEqual(pageReq.status, 200);
  });

  it('Should return 404 when requesting page by non existing chapter id', async () => {
    const pageReq = await request(app).get("/page/0");
    strictEqual(pageReq.status, 404);
  });
});