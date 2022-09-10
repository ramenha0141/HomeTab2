import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import goUrl from './goUrl';

const Youtube = () => {
    const [url, setUrl] = useState('');
    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 4, gap: 2 }}>
            <TextField label='URL' value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button
                variant='contained'
                disabled={!url}
                onClick={() => {
                    goUrl(
                        `https://hometab.live/api/youtube_download?url=${encodeURIComponent(url)}`
                    );
                    setUrl('');
                }}
            >
                Download
            </Button>
        </Box>
    );
};
export default Youtube;
