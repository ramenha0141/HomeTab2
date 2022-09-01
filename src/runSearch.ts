import goUrl from './goUrl';

const runSearch = (text: string) => {
    if (text.startsWith('url:') && text.length > 4) {
        goUrl(text.slice(4));
    } else {
        goUrl(`https://google.co.jp/search?q=${encodeURIComponent(text)}`);
    }
};
export default runSearch;
