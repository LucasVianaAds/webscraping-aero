const puppeteer = require('puppeteer');

async function buscarVideos(keyword, maxVideos = 10) {
  const browser = await puppeteer.launch({
    headless: 'new', // obrigatório na VPS (sem interface gráfica)
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();

  // força idioma / localização Brasil
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'pt-BR,pt;q=0.9',
  });

  // cookie de preferência de idioma/região do YouTube
  await page.setCookie({
    name: 'PREF',
    value: 'hl=pt-BR&gl=BR',
    domain: '.youtube.com',
  });

  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    keyword
  )}&hl=pt-BR&gl=BR`;

  await page.goto(url, { waitUntil: 'networkidle2' });

  // espera a lista de vídeos aparecer
  await page.waitForSelector('ytd-video-renderer', { timeout: 30000 });

  const videos = await page.evaluate((maxVideos) => {
    const items = Array.from(
      document.querySelectorAll('ytd-video-renderer')
    ).slice(0, maxVideos);

    return items.map((item) => {
      const titleEl = item.querySelector('#video-title');
      const viewsEl = item.querySelector('#metadata-line span');

      const titulo = titleEl ? titleEl.innerText.trim() : null;
      const link = titleEl ? titleEl.href : null;
      const visualizacoes = viewsEl ? viewsEl.innerText.trim() : null;

      return { titulo, link, visualizacoes };
    });
  }, maxVideos);

  await browser.close();
  return videos;
}

module.exports = { buscarVideos };
