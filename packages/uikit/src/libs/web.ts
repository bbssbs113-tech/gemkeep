export const getUserOS = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = window.navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    if (/Mac/.test(ua)) return 'mac';
    if (/Win/.test(ua)) return 'windows';
    return 'linux';
};
