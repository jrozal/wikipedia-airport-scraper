import puppeteer from 'puppeteer';
import fs from 'fs';

interface DataValues {
  'iata': string;
  'icao': string;
  'airport name': string;
  'Location served': string;
};

async function init() {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 250,
    });

    return browser;
  } catch (error) {
    throw error;
  }
}

async function loadPage(browser: puppeteer.Browser, url: string) {
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return page;
  } catch (error) {
    throw error;
  }
}

async function loadNextPage(page: puppeteer.Page, selector: string) {
  try {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click(selector)
    ]);
    return page;
  } catch (error) {
    throw error;
  }
}

function generateIataSelectors() {
  const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return alphabet.map((letter) => {
    let selector = `[title="List of airports by IATA airport code: ${letter}"]`;
    return selector;
  });
};

function saveNewJson(path: string, scrapedData: {}) {
  const jsonData = JSON.stringify(scrapedData, null, 2);
  return fs.writeFile(path, jsonData, (error) => {
    if (error) throw error;
  });
};

function saveToJson(path: string, data: Buffer, scrapedData: (DataValues | undefined)[]) {
  let newJson = JSON.parse(data.toString());
  newJson.push(...scrapedData);
  const jsonData = JSON.stringify(newJson, null, 2);
  return fs.writeFile(path, jsonData, (error) => {
    if (error) throw error;
  });
};

export {
  init,
  loadPage,
  loadNextPage,
  generateIataSelectors,
  saveNewJson,
  saveToJson,
};