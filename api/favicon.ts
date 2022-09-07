import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(await (await fetch('https://google.com')).text());
console.log(
    dom.window.document.head
        .querySelector<HTMLMetaElement>('meta[itemprop="image"]')
        ?.attributes.item(0)
);
