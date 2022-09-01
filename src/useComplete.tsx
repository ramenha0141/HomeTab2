import { useEffect, useMemo, useState } from 'react';
import useDebounce from './useDebounce';

interface Candidate {
    type: 'search' | 'url';
    text: string;
    detail?: string;
}

const useComplete = (text: string, setText: (text: string) => void) => {
    const debouncedText = useDebounce(text, 300);
    const [candidates, setCandidates] = useState<Candidate[]>();
    useEffect(() => {
        if (!debouncedText) return;
        if (debouncedText.startsWith('url:')) {
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
    return useMemo(() => {
        console.log(candidates);
        return null;
    }, [candidates]);
};
export default useComplete;
