import { atom } from 'jotai';

const createLocalStorageAtom = <T>(key: string, initialValue: T) => {
    const value = localStorage.getItem(key);
    const base = atom<T>(value ? (JSON.parse(value) as T) : initialValue);
    return atom<T, T>(
        (get) => get(base),
        (_, set, value) => {
            set(base, value);
            localStorage.setItem(key, JSON.stringify(value));
        }
    );
};
export default createLocalStorageAtom;
