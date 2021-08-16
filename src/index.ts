import fs from 'fs';
import {
  generateIataSelectors,
  init,
  loadNextPage,
  loadPage,
  saveNewJson,
  saveToJson,
} from './lib/helpers'
import { scrapeAndConvertData } from './lib/scrapeAndConvert';

async function wikiAirportScraper(url: string) {
  console.log('Initializing Wiki Airport Scraper');
  try {
    const browser = await init();
    const page = await loadPage(browser, url);
    const iataSelectors = generateIataSelectors();

    for (const selector of iataSelectors) {
      const nextPage = await loadNextPage(page, selector);

      const scrapedData = await scrapeAndConvertData(nextPage);

      fs.readFile('output.json', (err, data) => {
        if (err) {
          if (err.code !== 'ENOENT') throw err;
          return saveNewJson('output.json', scrapedData)
        }

        return saveToJson('output.json', data, scrapedData);
      });

      await nextPage.goBack();
    }

    await browser.close();
    console.log('Wiki Airport Scraping Complete');
  } catch (err) {
    console.error(err);
  }
};

const entryPoint = 'https://en.wikipedia.org/wiki/Lists_of_airports';
wikiAirportScraper(entryPoint);