import { Google as GoogleIcon, Web as WebIcon } from '@mui/icons-material';
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import runSearch from './runSearch';
import useDebounce from './useDebounce';

interface Candidate {
    type: 'search' | 'url';
    text: string;
    detail?: string;
}

const domain_pattern = /^([\w]{3,}\.)+?(com|jp|co\.jp|net|dev|io)$/;

const useComplete = (
    text: string,
    setText: (text: string) => void
): [ReactNode, { selectPrev: () => void; selectNext: () => void }] => {
    const debouncedText = useDebounce(text, 200);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    useEffect(() => {
        setSelectedIndex(null);
        if (!debouncedText) {
            setCandidates([]);
            return;
        }
        if (debouncedText.startsWith('url:') && debouncedText.length > 4) {
            setCandidates([
                {
                    type: 'url',
                    text: debouncedText,
                    detail: 'Open URL'
                }
            ]);
        } else {
            const isDomain = domain_pattern.test(debouncedText);
            fetch(`https://hometab.live/api/complete?q=${debouncedText}`)
                .then((res) => res.json())
                .then((candidates: string[]) => {
                    if (isDomain) {
                        setCandidates([
                            {
                                type: 'url',
                                text: debouncedText,
                                detail: 'Open URL'
                            },
                            ...candidates.map(
                                (candidate): Candidate => ({
                                    type: 'search',
                                    text: candidate
                                })
                            )
                        ]);
                    } else {
                        setCandidates(
                            candidates.map((candidate) => ({
                                type: 'search',
                                text: candidate
                            }))
                        );
                    }
                });
        }
    }, [debouncedText]);
    useEffect(() => {
        if (selectedIndex !== null) setText(candidates[selectedIndex].text);
    }, [selectedIndex]);
    const selectPrev = () => {
        if (selectedIndex !== null) {
            if (selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            } else {
                setSelectedIndex(candidates.length - 1);
            }
        } else {
            if (candidates.length) {
                setSelectedIndex(candidates.length - 1);
            }
        }
    };
    const selectNext = () => {
        if (selectedIndex !== null) {
            if (selectedIndex < candidates.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            } else {
                setSelectedIndex(0);
            }
        } else {
            if (candidates.length) {
                setSelectedIndex(0);
            }
        }
    };
    return [
        useMemo(
            () =>
                candidates.length ? (
                    <List dense>
                        {candidates.map((candidate, i) => (
                            <ListItem key={i} disablePadding>
                                <ListItemButton
                                    sx={{
                                        pr: 9,
                                        backgroundColor:
                                            i === selectedIndex
                                                ? 'rgba(255, 255, 255, 0.12)'
                                                : undefined
                                    }}
                                    onClick={() => runSearch(candidate.text)}
                                >
                                    <ListItemAvatar>
                                        {candidate.type === 'search' ? <GoogleIcon /> : <WebIcon />}
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{ textAlign: 'center' }}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontSize: 18
                                            }
                                        }}
                                        primary={candidate.text}
                                        secondary={candidate.detail}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : null,
            [candidates, selectedIndex]
        ),
        { selectPrev, selectNext }
    ];
};
export default useComplete;
