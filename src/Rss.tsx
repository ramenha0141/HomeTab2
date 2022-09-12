import { Box, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import createLocalStorageAtom from './createLocalStorageAtom';

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

const urlAtom = createLocalStorageAtom<string>('rss', '');

const Rss = () => {
    const [url, setUrl] = useAtom(urlAtom);
    const [feeds, setFeeds] = useState<RSSFeed[]>([]);
    useEffect(() => {
        if (!url) {
            setFeeds([]);
            return;
        }
        fetch(`https://hometab.live/api/rss?url=${url}`)
            .then((res) => res.json())
            .then(setFeeds);
    }, [url]);
    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mx: 4 }}>
            <TextField
                label='RSS URL(Comma separated)'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                sx={{ my: 2 }}
            />
            {feeds.map((feed, i) => (
                <Box key={i} sx={{ display: 'flex', py: 2 }}>
                    {feed.thumbnail && (
                        <img src={feed.thumbnail} style={{ height: 140, marginRight: 16 }} />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant='h5' component='div'>
                            {feed.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {feed.description}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};
export default Rss;
