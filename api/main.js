import ytdlp from 'yt-dlp-exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noDownload: true,
    });

    const links = info.formats
      .filter((f) => f.url)
      .map((f) => ({
        format_id: f.format_id,
        ext: f.ext,
        url: f.url,
      }));

    res.json({ title: info.title, links });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
