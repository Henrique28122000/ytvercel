import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    const cmd = `./yt-dlp -J --no-warnings --no-download "${url}"`;
    const { stdout } = await execAsync(cmd);

    const data = JSON.parse(stdout);
    const formats = data.formats || [];
    const links = formats
      .filter(f => f.url)
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        url: f.url
      }));

    return res.status(200).json({
      title: data.title,
      links
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
