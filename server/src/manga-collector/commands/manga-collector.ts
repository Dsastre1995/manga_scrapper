import { CreateMangaDTO } from "../../types";
import { createLocalImage } from "../utils/folder.utils";
import * as puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

class MangaCollector {
  private readonly DEFAULT_COVER_IMAGE = "https://i.blogs.es/10a197/captura-de-pantalla-2021-11-01-a-las-11.30.23/840_560.jpg";
  private readonly NAME_WRAPPER_SELECTOR = "div.wrapper section div.content-wrapper div.row div.col-md-9.col-sm-8.col-xs-12.manga-index-sinopsis-detail-cover-photo-layout div.panel.widget div.panel-heading h1";
  private readonly DESCRIPTION_WRAPPER_SELECTOR = "div.wrapper section div.content-wrapper div.row div.col-md-9.col-sm-8.col-xs-12.manga-index-sinopsis-detail-cover-photo-layout div.panel.widget div.panel-body";
  private readonly COVER_IMAGE_SELECTOR = "div.wrapper section div.content-wrapper div.row div.col-md-3.col-sm-4.manga-index-detail-cover-photo-layout div.panel.widget div.text-center.bg-center.custom-bg-center img";
  private mangasDir: string;
  private browser: puppeteer.Browser;
  private browserPage: puppeteer.Page;

  constructor(mangasDir: string, browser: puppeteer.Browser, browserPage: puppeteer.Page) {
    this.mangasDir = mangasDir;
    this.browser = browser;
    this.browserPage = browserPage;
  }

  private async getNameOrDescription(wrapperIdentifier: string): Promise<string> {
    try {
      const wrapper = await this.browserPage.$(wrapperIdentifier);
      const stringData: string = await this.browserPage.evaluate(el => el.textContent, wrapper);
  
      return stringData.trim();
    } catch (error) {
      this.browser.close();
      throw new Error('Error when scrapping manga string data');
    }
  }

  private async getMangaCover(): Promise<string> {
    try {
      const imageCover = await this.browserPage.$(this.COVER_IMAGE_SELECTOR);
      const image: string = await this.browserPage.evaluate(el => el.getAttribute("src"), imageCover);
  
      return image;
    } catch (error) {
      this.browser.close();
      throw new Error('Error when scrapping manga cover image');
    }
  }

  private createDirectory(name: string) {
    const formattedName = name.toLowerCase().split(" ").join("_");
    const mangaDir = path.join(this.mangasDir, `./${formattedName}`);
    if (!fs.existsSync(mangaDir)) {
      console.log(`Creating ${name} directory...`);
      fs.mkdirSync(path.join(this.mangasDir, `./${formattedName}`));
    }

    return mangaDir;
  }

  async collectData(mangaUrl: string): Promise<CreateMangaDTO | null> {
    console.log(`Collecting manga info from ${mangaUrl}...`);

    try {
      await this.browserPage.goto(mangaUrl);
      await this.browserPage.waitForSelector("div.content-wrapper");

      // Collect manga info
      const name = await this.getNameOrDescription(this.NAME_WRAPPER_SELECTOR);
      const description = await this.getNameOrDescription(this.DESCRIPTION_WRAPPER_SELECTOR);
      const image = await this.getMangaCover();

      // Create new manga folder
      const mangaDirectory = this.createDirectory(name);

      // Download cover image
      await createLocalImage(`https://inmanga.com${image}`, mangaDirectory);

      // Check if cover image was created || Take default image
      const imageUrl = !fs.existsSync(path.join(mangaDirectory, "cover.png")) ? this.DEFAULT_COVER_IMAGE : `file:///${path.resolve(mangaDirectory, "cover.png")}`;

      const mangaDTO: CreateMangaDTO = { name, description, image: imageUrl }

      return mangaDTO;

    } catch (error) {
      console.error("Something went wrong collecting manga data: ", error);
      this.browser.close();
      return null;
    }
  }
}

export default MangaCollector;