import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

interface RSS {
    status: 'ok' | 'error';
    message?: string;
    feed: {
        url: string;
        title: string;
        link: string;
        author: string;
        description: string;
        image: string;
    };
    items: RSSFeed[];
}
interface RSSFeed {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    enclosure: {
        link: string;
        type: string;
    };
}

const rss = async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://hometab.live');
    const { url } = req.query;
    if (!(url && url.length && typeof url === 'string')) {
        res.status(400).json({
            error: 'invalid "url" parameter'
        });
        return;
    }
    const urls = url.split(',');
    const feeds = (
        await Promise.all(
            urls.map(
                async (url) =>
                    (
                        await fetch(
                            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
                                url
                            )}`
                        )
                    ).json() as Promise<RSS>
            )
        )
    )
        .map((rss) => rss.items)
        .flat()
        .sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.description).getTime())
        .slice(0, 20);
    res.status(200).json(feeds);
};
export default rss;
