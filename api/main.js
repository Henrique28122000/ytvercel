import ytdlp from 'yt-dlp-exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing url in request body' });
  }

  try {
    // Executa yt-dlp para extrair informações do vídeo
    const info = await ytdlp(url, {
      dumpSingleJson: true, // Obter JSON completo do vídeo
      noWarnings: true,
      noDownload: true,
      // você pode adicionar outras opções do yt-dlp aqui, se quiser
    });

    // Filtra os formatos que possuem URL
    const links = (info.formats || [])
      .filter(f => f.url)
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        url: f.url,
      }));

    res.status(200).json({ title: info.title, links });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
