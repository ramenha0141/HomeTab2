import { Google as GoogleIcon, Web as WebIcon } from '@mui/icons-material';
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import runSearch from './runSearch';
import useDebounce from './useDebounce';

interface Candidate {
    type: 'search' | 'url';
    text: string;
    detail?: string;
}

const useComplete = (text: string, setText: (text: string) => void) => {
    const debouncedText = useDebounce(text, 200);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const candidateElements = useRef<HTMLDivElement[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    useEffect(() => {
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
            fetch(`https://hometab.live/api/complete?q=${debouncedText}`)
                .then((res) => res.json())
                .then((candidates: string[]) => {
                    setCandidates(
                        candidates.map((candidate) => ({
                            type: 'search',
                            text: candidate
                        }))
                    );
                });
        }
    }, [debouncedText]);
    return useMemo(
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
                                ref={(e) =>
                                    e
                                        ? (candidateElements.current[i] = e)
                                        : delete candidateElements.current[i]
                                }
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
        [candidates]
    );
};
export default useComplete;
