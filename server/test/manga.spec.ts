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

describe('Mangas API', () => {
  it('Should return status 200 when requesting mangas', async () => {
    const mangaReq = await request(app).get("/manga");
    strictEqual(mangaReq.status, 200);
  });

  it('Should return status 200 when requesting mangas with filters', async () => {
    const mangaReq = await request(app).get("/manga?isActive=true");
    strictEqual(mangaReq.status, 200);
  });

  it('Should return status 404 when requesting mangas with weird name', async () => {
    const mangaReq = await request(app).get("/manga?name='manga 3'");
    strictEqual(mangaReq.status, 404);
  });

  it('Should return status 200 when requesting manga by id', async () => {
    const mangaReq = await request(app).get(`/manga/${manga.id}`);
    strictEqual(mangaReq.status, 200);
  });

  it('Should return status 404 when requesting manga by non existing id', async () => {
    const mangaReq = await request(app).get("/manga/0");
    strictEqual(mangaReq.status, 404);
  });
});