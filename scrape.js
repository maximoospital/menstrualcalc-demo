import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrape() {
    let currentYear = new Date().getFullYear();
    let startYear = currentYear - 5;
    let endYear = currentYear + 5;
    let allItems = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Moon Phases Scraper for years " + startYear + " (two years before current year) to " + endYear + " (two years after current year)");

    for (let year = startYear; year <= endYear; year++) {
        await page.goto('https://www.timeanddate.com/moon/phases/?year=' + year);

        console.log('Current Year: ' + year);
        console.log('Scraping data...');

        // Create an array using data from the table with the classes "tb-sm zebra fw tb-hover". Info should be taken from the second to fifth columns, excluding the others. If the corresponding column and row is empty, skip this item and go to the following. Each item should have two values, a "Phase" parameter and "Date" parameter, the first one being taken from the column's header (New Moon, First Quarter, Full Moon or Third Quarter) and the second being taken from the corresponding td items with the classes "tr sep", which are in a DD MM format (11 Jan, 9 Feb, for example).
        let items = await page.evaluate(() => {
            const table = document.querySelector('.fw.hoz.tb-hover');
            const items = [];

            if (table) {
                const tbodies = table.querySelectorAll('tbody');
                if (tbodies.length >= 2) {
                    const rows = tbodies[1].querySelectorAll('tr');
                    rows.forEach(row => {
                        const columns = row.querySelectorAll('td');
                        columns.forEach(column => {
                            const imgs = column.querySelectorAll('img');
                            imgs.forEach(img => {
                                const titleParts = img.getAttribute('title').split(' ');
                                const phase = titleParts.slice(0, 2).join(' ');
                                const date = new Date(titleParts.slice(4, 7).join(' ').split(',')[0]);

                                items.push({
                                    Phase: phase,
                                    Date: date.toISOString().split('T')[0]
                                });
                            });
                        });
                    });
                }
            }

            return items;
        });

        allItems = allItems.concat(items);
    }

    await browser.close();

    return allItems;
}

// Example usage
scrape().then(items => {
    console.log("Items scraped saved in moon-phases.json");
    // Output items to a file called moon-phases.json in the public folder, replacing the file if it already exists
    fs.writeFileSync('public/moon-phases.json', JSON.stringify(items, null, 4));
}).catch(error => {
    console.error('Error:', error);
});