import { Box, Button, Link, TextField, Typography } from '@mui/material';
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
        getFeed();
    }, []);
    const getFeed = async () => {
        if (!url) {
            setFeeds([]);
            return;
        }
        setFeeds(await (await fetch(`https://hometab.live/api/rss?url=${url}`)).json());
    };
    return (
        <Box sx={{ flexGrow: 1, mx: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label='RSS URL (Comma separated)'
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    sx={{ my: 2 }}
                />
                <Button variant='contained' size='large' sx={{ ml: 2 }} onClick={() => getFeed()}>
                    Refresh
                </Button>
            </Box>

            {feeds.map((feed, i) => {
                const date = new Date(feed.pubDate);
                return (
                    <Link
                        key={i}
                        sx={{ display: 'flex', alignItems: 'center', py: 2 }}
                        href={feed.link}
                        color='inherit'
                        underline='hover'
                    >
                        {feed.thumbnail ? (
                            <img src={feed.thumbnail} style={{ height: 140, marginRight: 16 }} />
                        ) : (
                            <img
                                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${feed.link}&sz=64`}
                                style={{ height: 100, marginRight: 16 }}
                            />
                        )}

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='h5'>{feed.title}</Typography>
                            <Typography variant='body1' gutterBottom>
                                {`${
                                    feed.author
                                } - ${date.toLocaleDateString()} ${date.getHours()}:${(
                                    '0' + date.getMinutes()
                                ).slice(-2)}`}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {feed.description}
                            </Typography>
                        </Box>
                    </Link>
                );
            })}
        </Box>
    );
};
export default Rss;
