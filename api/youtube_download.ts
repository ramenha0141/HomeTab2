import type { VercelRequest, VercelResponse } from '@vercel/node';
import ytdl from 'ytdl-core';

const youtube_download = async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://hometab.live');
    const { url } = req.query;
    if (!(url && url.length && typeof url == 'string')) {
        res.status(400).json({
            error: 'invalid "url" parameter'
        });
        return;
    }
    try {
        const info = await ytdl.getBasicInfo(url);
        const stream = ytdl(url, {
            filter: (format) => !format.hasVideo && format.container === 'mp4',
            quality: 'highestaudio'
        });
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(info.videoDetails.title)}.mp3"`
        );
        stream.pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: ''
        });
    }
};
export default youtube_download;
