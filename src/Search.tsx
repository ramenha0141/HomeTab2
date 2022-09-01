import { Box, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import runSearch from './runSearch';
import useComplete from './useComplete';

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
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    const complete = useComplete(selectedText ?? text, setSelectedText);
    useEffect(() => setSelectedText(null), [text]);
    return (
        <SearchContainer>
            <SearchBox>
                <Input
                    placeholder='Search..'
                    autoFocus
                    value={selectedText ?? text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onCompositionStart={() => (isDuringComposition = true)}
                    onCompositionEnd={() => (isDuringComposition = false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isDuringComposition) {
                            runSearch(text);
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
