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
    const completes = JSON.parse(
        (
            await (
                await fetch(
                    `https://www.google.co.jp/complete/search?q=${encodeURI(
                        q as string
                    )}&client=gws-wiz&xssi=t&hl=ja`
                )
            ).text()
        ).slice(5)
    )[0].map((e) => e[0] as string);
    res.status(200).json(completes);
};

export default complete;
