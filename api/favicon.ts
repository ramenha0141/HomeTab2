import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const favicon = async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://hometab.live');
    const { url } = req.query;
    if (!url || !url.length) {
        res.status(400).json({
            error: '"url" parameter required'
        });
        return;
    }
    if (typeof url !== 'string') {
        res.status(400).json({
            error: 'bad "url" parameter'
        });
        return;
    }
    const response = await fetch(url);
    const head = new JSDOM(await response.text()).window.document.head;
    for (const element of head.querySelectorAll('link[rel*="icon"]')) {
        const href = element.getAttribute('href');
        if (href) {
            const url = new URL(href, response.url).href;
            const image = await (await fetch(url)).blob();
            res.status(200).send(image);
            return;
        }
    }
};
export default favicon;
