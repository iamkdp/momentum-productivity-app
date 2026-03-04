import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const quotes = JSON.parse(
    readFileSync(join(__dirname, '../data/quotes.json'), 'utf-8')
);

export const getDailyQuote = (req, res) => {
    const dayOfYear = Math.floor(
        (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    const quote = quotes[dayOfYear % quotes.length];
    res.json({ quote });
};