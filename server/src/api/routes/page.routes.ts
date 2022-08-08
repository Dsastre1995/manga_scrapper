import express from "express";
import PageService from "../services/page.service";

const router = express.Router();
const pageService = new PageService()

router.get('/:uuid', async (request, response, next) => {
  try {
    const { uuid } = request.params;
    const pages = await pageService.getAll(uuid);

    response.json(pages);
  } catch (error) {
    next(error);
  }
});

export default router;