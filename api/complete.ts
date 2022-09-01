import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const complete = async (req: VercelRequest, res: VercelResponse) => {
    const { q } = req.query;
    if (!q || !q.length) {
        res.status(400).json({
            error: '"q" parameter required'
        });
        return;
    }
    if (typeof q !== 'string') {
        res.status(400).json({
            error: 'bad "q" parameter'
        });
    }
    const completes = (
        await (
            await fetch(
                `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
                    q as string
                )}`
            )
        ).json()
    )[1];
    res.status(200).json(completes);
};

export default complete;
