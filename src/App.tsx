import {
    ChevronRight as ChevronRightIcon,
    FormatListBulleted as FormatListBulletedIcon,
    Tune as TuneIcon
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
    ThemeProvider,
    Typography,
    useMediaQuery
} from '@mui/material';
import { lazy, Suspense, useMemo, useState } from 'react';
import Bookmark from './Bookmark';
import Preferences from './Preferences';
import Search from './Search';

const Tasks = lazy(() => import('./Tasks'));

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
    const [showTodo, setShowTodo] = useState(false);
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
                    open={showTodo}
                    onClose={() => setShowTodo(false)}
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
                        <IconButton onClick={() => setShowTodo(false)}>
                            <ChevronRightIcon />
                        </IconButton>
                        <Typography variant='h5' sx={{ mx: 1 }}>
                            Tasks
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
                        <Tasks />
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
                <Fab onClick={() => setShowTodo(true)}>
                    <FormatListBulletedIcon />
                </Fab>
                <Fab onClick={() => setShowPreferences(true)}>
                    <TuneIcon />
                </Fab>
            </Box>
            <Preferences open={showPreferences} onClose={() => setShowPreferences(false)} />
        </ThemeProvider>
    );
};
export default App;
