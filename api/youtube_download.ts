import type { VercelRequest, VercelResponse } from '@vercel/node';
import ytdl from 'ytdl-core';
console.log(Object.keys(ytdl));

const youtube_download = async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://hometab.live');
    const { video, type } = req.query;
    if (!(video && video.length && typeof video == 'string')) {
        res.status(400).json({
            error: 'invalid "video" parameter'
        });
        return;
    }
    if (!(type === 'video' || type === 'audio')) {
        res.status(400).json({
            error: 'invalid "type" parameter'
        });
        return;
    }
    try {
        const info = await ytdl.getBasicInfo(video);
        const stream = ytdl(video, {
            filter: (format) =>
                type === 'video'
                    ? format.hasVideo && format.container === 'mp4'
                    : !format.hasVideo && format.container === 'mp4',
            quality: type === 'video' ? 'highest' : 'highestaudio'
        });
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${info.videoDetails.title}.${type === 'video' ? 'mp4' : 'mp3'}"`
        );
        stream.pipe(res);
    } catch (e) {
        console.log(e);
        res.status(400).json({
            error: ''
        });
    }
};
export default youtube_download;
