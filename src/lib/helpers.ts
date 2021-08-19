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
    const browser = await puppeteer.launch();
    return browser;
  } catch (error) {
    throw error;
  }
}

async function loadPage(browser: puppeteer.Browser, url: string) {
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);  // modified to 60s timeout for slow connections
    await page.goto(url, { waitUntil: 'domcontentloaded' });  // wait until dom content loads
    return page;
  } catch (error) {
    throw error;
  }
}

async function loadNextPage(page: puppeteer.Page, selector: string) {
  try {
    // click selector and wait for network idle to ensure fully loaded
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click(selector)
    ]);
    return page;
  } catch (error) {
    throw error;
  }
}

function generateIataSelectors() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

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