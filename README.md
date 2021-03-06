# Wikipedia Airport Scraper

Script built with Typescript and Puppeteer to scrape repetitive table structure, navigate over pages through repetitive button clicks, and
manipulate text and save all of the scraped info into a JSON structure.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Within the root directory:

* ### Installing

```
npm install
```

* ### Build and compile

```
npm run build
```

* ### Run the scraper

```
npm run start
```

* ### On success
```json
Data locally saved to 'output.json' in the root directory. File must be deleted before running the script again, else newly scraped data will be appended to file.

Sample output:

[
  {
    "iata": "AAA",
    "icao": "NTGA",
    "airport name": "anaa_airport",
    "Location served": "anaa_tuamotus_french_polynesia"
  },
  {...},
  ...
]
```

## Built With

* [Typescript](https://www.typescriptlang.org/docs/)
* [Puppeteer](https://pptr.dev/)

## Design Choices

Primary function `wikiAirportScraper` in `src/index.ts` utilizes 7 helper functions from `helpers.ts` and `scrapeAndConvert.ts`. Helper functions implemented and utilized for improved readability and maintainability.

    .
    ├── build
    ├── node_modules
    ├── src
    |   ├── lib
    |   |   ├── helpers.ts
    |   |   └── scrapeAndConvert.ts
    |   └── index.ts
    └── README.md