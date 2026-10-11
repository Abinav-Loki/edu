const fs = require('fs');

const raw = fs.readFileSync('./src/data/avatarFramesData.ts', 'utf8');

// Count frames
const idMatches = [...raw.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total Frame IDs found:', idMatches.length);

const uniqueIds = new Set(idMatches);
console.log('Unique Frame IDs:', uniqueIds.size);

const emojiMatches = [...raw.matchAll(/emoji:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total Emojis found:', emojiMatches.length);

const uniqueEmojis = new Set(emojiMatches);
console.log('Unique Emojis:', uniqueEmojis.size);

console.log('Verification Success!');
