import { Manga } from "../../types";
import { CreateChapterFromCommandDTO } from "../models/chapter.model";
import * as puppeteer from "puppeteer";

class ChapterCollector {
  private readonly CHAPTER_SELECTOR = "div.wrapper section div.content-wrapper div.row div.col-md-9.col-sm-8.col-xs-12.manga-index-chapter-list-cover-photo-layout div.panel.widget div.slimScrollDiv div#ChaptersContainer a.list-group-item.custom-list-group-item";
  private mangaUrl: string;
  private browser: puppeteer.Browser;
  private browserPage: puppeteer.Page;

  constructor(mangaUrl: string, browser: puppeteer.Browser, browserPage: puppeteer.Page) {
    this.mangaUrl = mangaUrl;
    this.browser = browser;
    this.browserPage = browserPage;
  }

  private async getChapterInfo(element: any, manga: Manga): Promise<CreateChapterFromCommandDTO> {
    try {
      const url: string = await this.browserPage.evaluate(el => el.getAttribute("href"), element);
      const chapter = await this.browserPage.evaluate(el => {
        const chapterInfo = el.getAttribute("data-c-number");
        const chapter: CreateChapterFromCommandDTO = {
          title: chapterInfo,
          chapterNumber: Number(chapterInfo.split(",").join("")),
          mangaId: "",
          url: ""
        }
  
        return chapter;
      }, element);
  
      return {...chapter, ...{mangaId: manga.id, url: `https://inmanga.com${url}`}};
    } catch (error) {
      this.browser.close();
      throw new Error("Error when trying to scrapp info");
    }
  }

  async collectChapter(manga: Manga): Promise<Array<CreateChapterFromCommandDTO>> {
    console.log(`Collecting ${manga.name} chapters info`);
    const chapters: Array<CreateChapterFromCommandDTO> = [];

    try {
      await this.browserPage.goto(this.mangaUrl);
      await this.browserPage.waitForTimeout(5000);
      this.browserPage.waitForTimeout(5000);

      // Remove list first element
      const firstElement = await this.browserPage.$(this.CHAPTER_SELECTOR);
      await this.browserPage.evaluate(el => el.remove(), firstElement);

      const chapterElements = await this.browserPage.$$(this.CHAPTER_SELECTOR);

      for(let i = 0; i < chapterElements.length ; i++) {
        const chapter: CreateChapterFromCommandDTO = await this.getChapterInfo(chapterElements[i], manga);
        if (chapter) chapters.push(chapter);
      }

      return chapters;

    } catch (error) {
      this.browser.close();
      console.error('Something went wrong collecting chapters data:', error);
      return [];
    }
  }
}

export default ChapterCollector;