import {
    Apps as AppsIcon,
    Calculate as CalculateIcon,
    ChevronRight as ChevronRightIcon,
    FormatListBulleted as FormatListBulletedIcon,
    RssFeed,
    Tune as TuneIcon,
    YouTube as YouTubeIcon
} from '@mui/icons-material';
import {
    Box,
    CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    Drawer,
    Fab,
    IconButton,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    ThemeProvider,
    Typography,
    useMediaQuery
} from '@mui/material';
import { lazy, Suspense, useMemo, useState } from 'react';
import Bookmark from './Bookmark';
import Preferences from './Preferences';
import Search from './Search';

const Tasks = lazy(() => import('./Tasks'));
const Youtube = lazy(() => import('./Youtube'));
const Calculator = lazy(() => import('./Calculator'));
const Rss = lazy(() => import('./Rss'));

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
    const [app, setApp] = useState<'tasks' | 'youtube' | 'calculator' | 'rss' | null>(null);
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
                    ></Box>
                </Container>
                <Drawer
                    variant='temporary'
                    anchor='right'
                    open={!!app}
                    onClose={() => setApp(null)}
                >
                    <Box
                        sx={{
                            width: 400,
                            height: 50,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            px: 1
                        }}
                    >
                        <IconButton onClick={() => setApp(null)}>
                            <ChevronRightIcon />
                        </IconButton>
                        <Typography variant='h5' sx={{ mx: 0.5 }}>
                            {app === 'tasks'
                                ? 'Tasks'
                                : app === 'youtube'
                                ? 'Youtube Downloader'
                                : app === 'calculator'
                                ? 'Calculator'
                                : app === 'rss'
                                ? 'RSS Feed'
                                : ''}
                        </Typography>
                    </Box>
                    <Suspense
                        fallback={
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <CircularProgress color='inherit' />
                            </Box>
                        }
                    >
                        {app === 'tasks' ? (
                            <Tasks />
                        ) : app === 'youtube' ? (
                            <Youtube />
                        ) : app === 'calculator' ? (
                            <Calculator />
                        ) : app === 'rss' ? (
                            <Rss />
                        ) : null}
                    </Suspense>
                </Drawer>
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    right: 32,
                    bottom: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <SpeedDial
                    ariaLabel='apps'
                    icon={<SpeedDialIcon icon={<AppsIcon />} openIcon={<AppsIcon />} />}
                >
                    <SpeedDialAction
                        icon={<FormatListBulletedIcon />}
                        tooltipTitle='Tasks'
                        onClick={() => setApp('tasks')}
                    />
                    <SpeedDialAction
                        icon={<YouTubeIcon />}
                        tooltipTitle='Youtube Downloader'
                        onClick={() => setApp('youtube')}
                    />
                    <SpeedDialAction
                        icon={<CalculateIcon />}
                        tooltipTitle='Calculator'
                        onClick={() => setApp('calculator')}
                    />
                    <SpeedDialAction
                        icon={<RssFeed />}
                        tooltipTitle='RSS Feed'
                        onClick={() => setApp('rss')}
                    />
                </SpeedDial>
                <Fab onClick={() => setShowPreferences(true)}>
                    <TuneIcon />
                </Fab>
            </Box>
            <Preferences open={showPreferences} onClose={() => setShowPreferences(false)} />
        </ThemeProvider>
    );
};
export default App;
