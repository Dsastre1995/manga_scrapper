import express from "express";
import { MangasQueryParams } from "../../types";
import MangaService from "../services/manga.service";

const router = express.Router();
const mangaService = new MangaService();

router.get('/', async (request, response, next) => {
  try {
    const queryParams: MangasQueryParams = request.query;
    const mangas = await mangaService.getAll(queryParams);

    response.json(mangas);
  } catch (error) {
    next(error)
  }
});

router.get('/:uuid', async (request, response, next) => {
  try {
    const { uuid } = request.params;
    const manga = await mangaService.getById(uuid);

    response.json(manga);
  } catch (error) {
    next(error);
  }
});

export default router;