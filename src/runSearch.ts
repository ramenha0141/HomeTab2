import goUrl from './goUrl';
import { Candidate } from './useComplete';

const runSearch = (candidate: Candidate) => {
    switch (candidate.type) {
        case 'url': {
            goUrl(candidate.text.slice(4));
            break;
        }
        case 'npm': {
            goUrl(`https://www.npmjs.com/search?q=${encodeURIComponent(candidate.text.slice(4))}`);
            break;
        }
        case 'search': {
            goUrl(`https://www.google.co.jp/search?q=${encodeURIComponent(candidate.text)}`);
        }
    }
};
export default runSearch;
