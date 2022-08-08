import { strictEqual } from "assert";
import request from "supertest";
import app from "../src/api/app";
import { Manga } from "../src/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let manga: Manga;

before(async () => {
  const result: Array<Manga> = await prisma.$queryRaw<Manga[]>`SELECT * FROM Manga LIMIT 1`;
  manga = result[0];
});

describe('Chapter API', () => {
  it('Should return 200 when requesting chapters by manga id', async () => {
    const chaptersReq = await request(app).get(`/chapter/${manga.id}`);
    strictEqual(chaptersReq.status, 200);
  });

  it('Should return 404 when requesting chapters by non existing manga id', async () => {
    const chaptersReq = await request(app).get("/chapter/0");
    strictEqual(chaptersReq.status, 404);
  });
});