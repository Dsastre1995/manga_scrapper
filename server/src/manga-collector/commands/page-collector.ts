import * as puppeteer from "puppeteer";
import { Chapter, CreatePageDTO } from "../../types";

class PageCollector {
  private readonly PAGE_SELECTOR = "div.wrapper section div.content-wrapper div.row div.col-xs-12.p0.chapterIndexContainer div.col-md-12 div.p0.col-sm-12.col-xs-12.PagesContainer a.NextPage img";
  private browser: puppeteer.Browser;
  private browserPage: puppeteer.Page;
  private chapter: Chapter;

  constructor(chapter: Chapter, browser: puppeteer.Browser, browserPage: puppeteer.Page) {
    this.chapter = chapter;
    this.browser = browser;
    this.browserPage = browserPage
  }

  private async createPageObject(element: any): Promise<CreatePageDTO> {
    try {
      const id = await this.browserPage.evaluate(el => el.getAttribute("id"), element);
      const pageOrder = await this.browserPage.evaluate(el => el.getAttribute("data-pagenumber"), element);
    
      return {
        pageUrl: `https://pack-yak.intomanga.com/images/manga/One-Piece/chapter/${this.chapter.chapterNumber}/page/${pageOrder}/${id}`,
        pageOrder: +pageOrder,
        chapterId: this.chapter.id
      };
    } catch (error) {
      throw new Error(`Error when collection page url: ${error}`)
    }
  }

  async collectPages(pageUrl: string): Promise<Array<CreatePageDTO>> {
    console.log(`Collecting chapter ${this.chapter.chapterNumber}...`);
    const pages: Array<CreatePageDTO> = [];

    try {
      await this.browserPage.goto(pageUrl);
      await this.browserPage.waitForTimeout(2000);

      // Iterate over pages and download images
      const pagesSelectorOptions = await this.browserPage.$$(this.PAGE_SELECTOR);

      for(let i = 0; i < pagesSelectorOptions.length ; i++) {
        const page = await this.createPageObject(pagesSelectorOptions[i]);
        if (page) pages.push(page);
      }

      return pages;

    } catch (error) {
      console.error(`Something went wrong when collecting pages from chapter ${this.chapter.chapterNumber}: `, error);
      this.browser.close();
      return [];
    }
  }
}

export default PageCollector;