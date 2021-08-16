import puppeteer from 'puppeteer';

interface DataValues {
  'iata': string;
  'icao': string;
  'airport name': string;
  'Location served': string;
};

export async function scrapeAndConvertData(page: puppeteer.Page) {
  try {
    return await page.evaluate(() => {
      const tableRowData = Array.from(document.querySelectorAll('#mw-content-text > div.mw-parser-output > table > tbody tr:not(.sortbottom)'));

      const convertData = (obj: DataValues): DataValues => {
        return ({
          'iata': obj['iata'].replace(/[0-9]/g, 'DAPI'),
          'icao': obj['icao'].replace(/[0-9]/g, 'DAPI'),
          'airport name': obj['airport name'].replace(/[0-9]/g, 'DAPI').toLowerCase().replace(/[\s,]+/g,'_').trim(),
          'Location served': obj['Location served'].replace(/[0-9]/g, 'DAPI').toLowerCase().replace(/[\s,]+/g,'_').trim()
        });
      };

      return tableRowData.map((row) => {
        if (row instanceof HTMLTableRowElement) {
          const cells = Array.from(row.cells);
          const data = {
            'iata': cells[0].innerText,
            'icao': cells[1].innerText,
            'airport name': cells[2].innerText,
            'Location served': cells[3].innerText
          };

          return convertData(data);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};