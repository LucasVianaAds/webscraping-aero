const express = require('express');
const { buscarDadosInstagram } = require('./instagramScraper');
const { buscarVideos } = require('./youtubeScraper');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Servidor WebScraper está rodando!' });
});

// Rota Instagram (a gente deixa aqui, mesmo que volte nela depois)
app.post('/instagram', async (req, res) => {
  const { hashtag, maxPosts } = req.body;

  if (!hashtag) {
    return res
      .status(400)
      .json({ error: 'A propriedade "hashtag" é obrigatória no body.' });
  }

  try {
    const posts = await buscarDadosInstagram(hashtag, maxPosts || 10);
    return res.json({
      message: 'Busca no Instagram concluída com sucesso!',
      posts,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do Instagram:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do Instagram.' });
  }
});

// 🆕 Rota YouTube
app.post('/youtube', async (req, res) => {
  const { keyword, maxVideos } = req.body;

  if (!keyword) {
    return res
      .status(400)
      .json({ error: 'A propriedade "keyword" é obrigatória no body.' });
  }

  try {
    const videos = await buscarVideos(keyword, maxVideos || 10);
    return res.json({
      message: 'Busca no YouTube concluída com sucesso!',
      videos,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do YouTube:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do YouTube.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
