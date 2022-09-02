import { Tune as TuneIcon } from '@mui/icons-material';
import {
    Box,
    Container,
    createTheme,
    CssBaseline,
    Fab,
    ThemeProvider,
    useMediaQuery
} from '@mui/material';
import { useMemo, useState } from 'react';
import Bookmark from './Bookmark';
import Preferences from './Preferences';
import Search from './Search';

const searchParams = new URL(window.location.href).searchParams;
if (searchParams.has('migrate') && !localStorage.getItem('bookmarkItems')) {
    localStorage.setItem('bookmarkItems', searchParams.get('migrate')!);
    location.replace(location.origin);
}

const App = () => {
    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light'
                }
            }),
        [darkMode]
    );
    const [showPreferences, setShowPreferences] = useState(false);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: `url("/wallpaper/Monterey ${
                        darkMode ? 'Dark' : 'Light'
                    }.webp")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            >
                <Container
                    maxWidth='lg'
                    sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
                >
                    <Box sx={{ flexGrow: 2 }} />
                    <Search />
                    <Bookmark />
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center'
                        }}
                    >
                        <Fab onClick={() => setShowPreferences(true)}>
                            <TuneIcon />
                        </Fab>
                    </Box>
                </Container>
            </Box>
            <Preferences open={showPreferences} onClose={() => setShowPreferences(false)} />
        </ThemeProvider>
    );
};
export default App;
