const goUrl = (url: string, newTab?: boolean) => {
    if (newTab) {
        window.open(
            url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`,
            '_blank'
        );
    } else {
        location.href =
            url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`;
    }
};
export default goUrl;
