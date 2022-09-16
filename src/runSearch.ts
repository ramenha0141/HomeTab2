import goUrl from './goUrl';

const runSearch = (text: string) => {
    if (text.startsWith('url:') && text.length > 4) {
        goUrl(text.slice(4));
    } else if (text.startsWith('npm:') && text.length > 4) {
        goUrl(`https://www.npmjs.com/search?q=${encodeURIComponent(text.slice(4))}`);
    } else {
        goUrl(`https://www.google.co.jp/search?q=${encodeURIComponent(text)}`);
    }
};
export default runSearch;
