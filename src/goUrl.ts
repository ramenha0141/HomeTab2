const goUrl = (url: string) => {
    location.href =
        url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`;
};
export default goUrl;
