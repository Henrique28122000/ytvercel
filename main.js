const express = require('express');
const { exec } = require('child_process');
const ytDlp = require('yt-dlp-exec');

const app = express();
app.use(express.json());

app.post('/extract', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Usando yt-dlp-exec para pegar o JSON do vídeo
    const info = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noDownload: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      // Você pode passar outras opções aqui se quiser
    });

    // Selecionar formatos mp4 (ou outros se quiser)
    const formats = info.formats || [];
    const links = formats
      .filter(f => f.ext === 'mp4' && f.url)
      .map(f => ({ format_id: f.format_id, ext: f.ext, url: f.url }));

    res.json({
      title: info.title,
      formats: links,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao extrair vídeo', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
