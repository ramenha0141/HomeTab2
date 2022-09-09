import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const complete = async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://hometab.live');
    const { q } = req.query;
    if (!(q && q.length && typeof q === 'string')) {
        res.status(400).json({
            error: 'invalid "q" parameter'
        });
        return;
    }
    const completes = (
        await (
            await fetch(
                `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
                    q
                )}`
            )
        ).json()
    )[1];
    res.status(200).json(completes);
};
export default complete;
