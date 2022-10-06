import {
    Bookmark as BookmarkIcon,
    Google as GoogleIcon,
    Web as WebIcon
} from '@mui/icons-material';
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import runSearch from './runSearch';
import useDebounce from './useDebounce';
import npmIcon from './assets/npm.svg';
import { search } from '@lyrasearch/lyra';
import { bookmarkDB } from './Bookmark';

export interface Candidate {
    type: 'search' | 'url' | 'npm' | 'bookmark';
    text: string;
    url: string;
    detail?: string;
}

const domain_pattern = /^([\w]{3,}\.)+?(com|jp|co\.jp|net|dev|io)$/;

const useComplete = (
    text: string,
    setSelectedCandidate: (candidate: Candidate) => void
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
                    url: debouncedText,
                    detail: 'Open URL'
                }
            ]);
        } else if (debouncedText.startsWith('npm:') && debouncedText.length > 4) {
            setCandidates([
                {
                    type: 'npm',
                    text: debouncedText,
                    url: `https://www.npmjs.com/search?q=${encodeURIComponent(
                        debouncedText.slice(4)
                    )}`,
                    detail: 'Search NPM Package'
                }
            ]);
        } else {
            const isDomain = domain_pattern.test(debouncedText);
            const { hits: bookmarks } = search(bookmarkDB, { term: debouncedText });
            const bookmarkCandidates = bookmarks.slice(0, 3).map(
                (bookmark): Candidate => ({
                    type: 'bookmark',
                    text: bookmark.title,
                    detail: `Open ${bookmark.url}`,
                    url: bookmark.url
                })
            );
            fetch(`https://hometab.live/api/complete?q=${debouncedText}`)
                .then((res) => res.json())
                .then((candidates: string[]) => {
                    const searchCandidates = candidates.map(
                        (candidate): Candidate => ({
                            type: 'search',
                            text: candidate,
                            url: `https://www.google.co.jp/search?q=${encodeURIComponent(
                                debouncedText
                            )}`
                        })
                    );
                    if (isDomain) {
                        setCandidates([
                            {
                                type: 'url',
                                text: debouncedText,
                                url: debouncedText,
                                detail: 'Open URL'
                            },
                            ...bookmarkCandidates,
                            ...searchCandidates
                        ]);
                    } else {
                        setCandidates([...bookmarkCandidates, ...searchCandidates]);
                    }
                });
        }
    }, [debouncedText]);
    useEffect(() => {
        if (selectedIndex !== null) setSelectedCandidate(candidates[selectedIndex]);
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
                                    onClick={() => runSearch(candidate)}
                                >
                                    <ListItemAvatar>
                                        {candidate.type === 'search' ? (
                                            <GoogleIcon />
                                        ) : candidate.type === 'url' ? (
                                            <WebIcon />
                                        ) : candidate.type === 'bookmark' ? (
                                            <BookmarkIcon />
                                        ) : (
                                            <img src={npmIcon} style={{ height: 24 }} />
                                        )}
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
