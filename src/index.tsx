import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';

const searchParams = new URL(window.location.href).searchParams;
if (searchParams.has('migrate') && !localStorage.getItem('bookmarkItems')) {
    localStorage.setItem('bookmarkItems', searchParams.get('migrate')!);
    location.replace(location.origin);
}

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);
