const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Função principal de scraping.
 * origin, destination: códigos IATA ou texto (ex: "GRU", "MAD")
 * departureDate: string no formato YYYY-MM-DD (já formatada no server.js)
 */
async function scrapeFlights({ origin, destination, departureDate }) {
  console.log('Iniciando scraping de voos...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--single-process'
    ],
  });

  const page = await browser.newPage();

  try {
    console.log('Acessando o site...');
    await page.goto('https://www.seats.aero/', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    console.log('Simulando comportamento humano...');
    await delay(2000);

    console.log('Preenchendo campo de origem/destino...');

    // Espera qualquer input com essa classe aparecer
    await page.waitForSelector('input.vs__search', { timeout: 30000 });

    const inputs = await page.$$('input.vs__search');

    if (inputs.length < 2) {
      throw new Error('Não encontrei os campos de origem/destino na tela.');
    }

    const originInput = inputs[0];
    const destinationInput = inputs[1];

    console.log('Preenchendo campo de origem...');
    await originInput.click();
    for (const char of origin) {
      await page.keyboard.type(char, { delay: 200 });
    }
    await delay(1500);
    await page.keyboard.press('Enter');
    await delay(2000);

    console.log('Preenchendo campo de destino...');
    await destinationInput.click();
    for (const char of destination) {
      await page.keyboard.type(char, { delay: 200 });
    }
    await delay(1500);
    await page.keyboard.press('Enter');
    await delay(2000);

    // Por enquanto, retorno fake só pra validar infra.
    const fakeResult = [
      {
        origin,
        destination,
