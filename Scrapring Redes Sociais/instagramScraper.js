const puppeteer = require('puppeteer');

async function buscarDadosInstagram(hashtag, maxPosts = 10) {
  const browser = await puppeteer.launch({
    headless: false, // deixa visível pra você enxergar o que está acontecendo
  });

  const page = await browser.newPage();

  const url = `https://www.instagram.com/explore/tags/${encodeURIComponent(
    hashtag
  )}/`;

  // Acessa a página da hashtag
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Dá um tempo pra página carregar (e pra você ver o que aparece)
  await page.waitForTimeout(8000);

  const posts = await page.evaluate((maxPosts) => {
    // Pega todos os links que parecem ser de posts (/p/ no href)
    const anchors = Array.from(document.querySelectorAll('a'))
      .filter((a) => a.href.includes('/p/'))
      .slice(0, maxPosts);

    return anchors.map((el) => {
      const imgEl = el.querySelector('img');
      const image = imgEl ? imgEl.src : null;

      return {
        link: el.href,
        image,
      };
    });
  }, maxPosts);

  console.log('Encontrados', posts.length, 'posts na página');

  await browser.close();
  return posts;
}

module.exports = { buscarDadosInstagram };
