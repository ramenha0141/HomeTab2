import { Box, TextField } from '@mui/material';
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
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
                label='RSS URL(Comma separated)'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                sx={{ mx: 2 }}
            />
            {feeds.map((feed) => feed.title)}
        </Box>
    );
};
export default Rss;
