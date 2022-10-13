export const config = {
    runtime: 'experimental-edge'
};

export default async (req: Request): Promise<Response> => {
    const q = new URL(req.url).searchParams.get('q');
    if (!(q && q.length && typeof q === 'string')) {
        const res = new Response(null, { status: 400, statusText: 'invalid "q" parameter' });
        cors(req, res);
        return res;
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
    const res = new Response(JSON.stringify(completes));
    cors(req, res);
    return res;
};

const cors = (req: Request, res: Response) => {
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    if (req.headers.get('origin') === 'http://localhost:5173') {
        res.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    } else {
        res.headers.set('Access-Control-Allow-Origin', 'https://hometab.live');
    }
};
