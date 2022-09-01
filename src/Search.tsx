import { Box, styled } from '@mui/material';
import { useState } from 'react';
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

const Search = () => {
    const [text, setText] = useState('');
    const complete = useComplete(text, setText);
    return (
        <SearchContainer>
            <SearchBox>
                <Input
                    placeholder='Search..'
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </SearchBox>
            <Box>{complete}</Box>
        </SearchContainer>
    );
};
export default Search;
