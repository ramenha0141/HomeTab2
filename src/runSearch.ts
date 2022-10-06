import goUrl from './goUrl';
import { Candidate } from './useComplete';

const runSearch = (candidate: Candidate) => {
    candidate.url && goUrl(candidate.url);
};
export default runSearch;
