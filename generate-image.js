// generate-image.js
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Odpri lokalno HTML datoteko
    const htmlPath = `file:${path.join(__dirname, 'index.html')}`;
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    
    // Počakaj, da se element naloži
    await page.waitForSelector('#shareable-image-template', { timeout: 10000 });
    const element = await page.$('#shareable-image-template');
    
    if (element) {
        // Spremeni pozicijo elementa, da ga je mogoče pravilno posneti
        await page.evaluate(el => {
            el.style.position = 'absolute';
            el.style.left = '0px';
            el.style.top = '0px';
        }, element);

        // === KLJUČNA SPREMEMBA ===
        // Nastavi viewport na pravilno velikost slike (1200x628)
        await page.setViewport({ width: 1200, height: 628 });

        // Naredi posnetek zaslona in ga shrani
        await element.screenshot({ path: 'share-image.png' });
        console.log('Slika share-image.png je bila uspešno ustvarjena.');
    } else {
        console.error('Napaka: Element #shareable-image-template ni bil najden.');
        process.exit(1); // Izhod z napako
    }

    await browser.close();
})();
