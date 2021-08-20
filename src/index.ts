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
  console.log('Initializing Wikipedia Airport Scraper');
  try {
    const browser = await init();
    const page = await loadPage(browser, url);
    const iataSelectors = generateIataSelectors();

    // iterate through each selector, click link, scrape and convert data, and save to local json file
    for (const selector of iataSelectors) {
      const nextPage = await loadNextPage(page, selector);
      console.log('Scraping airport data for alphabet letter:', selector.slice(-3, -2));
      const scrapedData = await scrapeAndConvertData(nextPage);

      fs.readFile('output.json', (err, data) => {
        // if file does not exist, create and save new json file
        if (err) {
          if (err.code !== 'ENOENT') throw err;
          return saveNewJson('output.json', scrapedData)
        }

        // else save to existing json file
        return saveToJson('output.json', data, scrapedData);
      });

      await nextPage.goBack();
    }

    // close browser and log completion notice to console
    await browser.close();
    console.log('Wikipedia Airport Scraping Complete');
  } catch (err) {
    console.error(err);
  }
};

const entryPoint = 'https://en.wikipedia.org/wiki/Lists_of_airports';
wikiAirportScraper(entryPoint);