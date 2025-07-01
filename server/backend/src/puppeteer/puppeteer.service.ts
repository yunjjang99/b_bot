// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, LaunchOptions } from "puppeteer-core";
//import { BrowserFactory } from "./interfaces/browser-factory.interface";
//import * as realBrowser from "puppeteer-real-browser";

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  private readonly logger = new Logger(PuppeteerService.name);
  private browsers: Browser[] = [];

  async createBrowser(options?: LaunchOptions): Promise<Browser> {
    const { connect } = require("puppeteer-real-browser");
    const { browser, page } = await connect({
      headless: false,
      //   devtools: true, // 자동으로 개발자 도구 열기
      executablePath: process.env.CHROME_PATH,

      args: [],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,

      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: true,
      ignoreAllFlags: false,
      // proxy:{
      //     host:'<proxy-host>',
      //     port:'<proxy-port>',
      //     username:'<proxy-username>',
      //     password:'<proxy-password>'
      // }
    });

    this.browsers.push(browser);

    console.log(process.env.CHROME_PATH, " path");
    return browser;
  }

  async onModuleDestroy() {
    this.logger.log("모듈 종료, 브라우저 모두 종료");
    await Promise.all(this.browsers.map((b) => b.close()));
  }
}
