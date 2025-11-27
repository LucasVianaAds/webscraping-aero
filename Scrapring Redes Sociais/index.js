const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Desativa o modo headless
  const page = await browser.newPage();
  await page.goto('https://google.com');
  console.log('Page loaded!');

  await page.type('textarea#APjFqb', 'Passagens áereas com melhor');
  await page.click('input.gNO89b');

  //await browser.close();
})();
