import express from "express";
import ChapterService from "../services/chapter.service";

const router = express.Router();
const chapterService = new ChapterService();

router.get('/:uuid', async (request, response, next) => {
  try {
    const { uuid } = request.params;
    const chapters = await chapterService.getAll(uuid);

    response.json(chapters);
  } catch (error) {
    next(error)
  }
});

export default router;