import { CreateChapterDTO, CreateMangaDTO, CreatePageDTO } from "../types";
import { CreateChapterFromCommandDTO } from "./models/chapter.model";
import { createLocalImage } from "./utils/folder.utils";

import createManga from "./services/manga.service";
import createChapter from "./services/chapter.service";
import createPage from "./services/page.service";

import MangaCollector from "./commands/manga-collector";
import ChapterCollector from "./commands/chapter-collector";
import PageCollector from "./commands/page-collector";

import fs from "fs";
import path from "path";
import * as puppeteer from "puppeteer";

const PUBLIC_PATH = path.resolve(__dirname, "../api/public");
const ONE_PIECE_URL = "https://inmanga.com/ver/manga/One-Piece/dfc7ecb5-e9b3-4aa5-a61b-a498993cd935";

const createMangasDir = () => {
  if (!fs.existsSync(PUBLIC_PATH)) {
    console.log("Creating mangas directory...");
    fs.mkdirSync(PUBLIC_PATH);
  }
};

const createChaptersDirs = (chapterNumber: number, mangaName: string) => {
  const CHAPTER_DIR = path.join(PUBLIC_PATH, `./${mangaName.toLowerCase().replace(" ", "_")}`, `./${chapterNumber}`);
  if (!fs.existsSync(CHAPTER_DIR)) {
    console.log(`Creating directory for chapter ${chapterNumber}...`);
    fs.mkdirSync(CHAPTER_DIR);
  }
};

const createChapterEntity = async (chapter: CreateChapterDTO, mangaName: string) => {
  const createdChapter = await createChapter(chapter);
  if (createdChapter) createChaptersDirs(createdChapter.chapterNumber, mangaName);

  return createdChapter;
};

(async () => {

  // Create puppetier Browser, Browser Page instances
  const browser = await puppeteer.launch();
  const browserPage = await browser.newPage(); 

  // Create Manga Directory
  createMangasDir();

  // Collect Manga Info
  const mangaCollector = new MangaCollector(PUBLIC_PATH, browser, browserPage);
  const mangaDTO: CreateMangaDTO | null = await mangaCollector.collectData(ONE_PIECE_URL);
  if (mangaDTO) {
    const createdManga = await createManga(mangaDTO);

    // Collect Chapters
    const chapterCollector = new ChapterCollector(ONE_PIECE_URL, browser, browserPage);
    const chaptersDTOs: Array<CreateChapterFromCommandDTO> = await chapterCollector.collectChapter(createdManga)
    if (chaptersDTOs) {
      for (let chapter of [chaptersDTOs[0], chaptersDTOs[1]]) {
        // Collect Pages
        const { url, ...rest } = chapter;
        const chapterToBeCreated: CreateChapterDTO = rest;
        const createdChapter = await createChapterEntity(chapterToBeCreated, mangaDTO.name);

        // Collect Pages
        const pageDir = path.join(
          PUBLIC_PATH,
          `./${mangaDTO.name.toLowerCase().replace(" ", "_")}`,
          `./${createdChapter.chapterNumber}`
        );

        const pageCollector = new PageCollector(createdChapter, browser, browserPage);
        const pages: Array<CreatePageDTO> = await pageCollector.collectPages(chapter.url) || [];
        pages.forEach(async (page: CreatePageDTO) => {
          const pageName = `${page.pageOrder}.png`
          const pageUrl = `${createdManga.name.toLowerCase().split(' ').join("_")}/${chapter.chapterNumber}/${page.pageOrder}.png`
          await createLocalImage(page.pageUrl, pageDir, pageName);
          const createdPage = await createPage({...page, pageUrl});
          if (createdPage) console.log(`Created page ${page.pageOrder}`)
        });
      }
    }
  }

  browser.close();
})();