import { Box, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import goUrl from './goUrl';
import runSearch from './runSearch';
import useComplete, { Candidate } from './useComplete';

const SearchContainer = styled('div')({
    position: 'relative',
    width: '100%',
    height: 60,
    margin: '64px 0'
});
const SearchBox = styled('div')(({ theme }) => ({
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(40px)',
    boxShadow: '0 10px 15px rgb(0 0 0 / 20%)'
}));
const Input = styled('input')(({ theme }) => ({
    width: '100%',
    height: 60,
    fontSize: 22,
    textAlign: 'center',
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    padding: '0 24px',
    background: 'none',
    border: 'none',
    outline: 'none'
}));

let isDuringComposition = false;

const Search = () => {
    const [text, setText] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [focused, setFocused] = useState(false);
    const [complete, { selectPrev, selectNext }] = useComplete(text, setSelectedCandidate);
    useEffect(() => setSelectedCandidate(null), [text]);
    return (
        <SearchContainer>
            <SearchBox>
                <Input
                    placeholder='Search..'
                    autoFocus
                    value={selectedCandidate?.text ?? text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onCompositionStart={() => (isDuringComposition = true)}
                    onCompositionEnd={() => (isDuringComposition = false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (!isDuringComposition) {
                                if (selectedCandidate) {
                                    runSearch(selectedCandidate);
                                } else {
                                    if (text.startsWith('url:') && text.length > 4) {
                                        goUrl(text.slice(4));
                                    } else if (text.startsWith('npm:') && text.length > 4) {
                                        goUrl(
                                            `https://www.npmjs.com/search?q=${encodeURIComponent(
                                                text.slice(4)
                                            )}`
                                        );
                                    } else {
                                        goUrl(
                                            `https://www.google.co.jp/search?q=${encodeURIComponent(
                                                text
                                            )}`
                                        );
                                    }
                                }
                            }
                        } else if (e.key === 'Escape') {
                            e.currentTarget.blur();
                            setFocused(false);
                        } else if (e.key === 'ArrowUp') {
                            selectPrev();
                            e.preventDefault();
                        } else if (e.key === 'ArrowDown') {
                            selectNext();
                            e.preventDefault();
                        }
                    }}
                />
                {focused && complete}
            </SearchBox>
            {focused && (
                <Box
                    sx={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        width: '100vw',
                        height: '100vh'
                    }}
                    onClick={() => setFocused(false)}
                />
            )}
        </SearchContainer>
    );
};
export default Search;
