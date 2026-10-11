const fs = require('fs');

const raw = fs.readFileSync('./src/data/avatarFramesData.ts', 'utf8');
const lines = raw.split('\n');

const frames = [];
let current = {};
for (const line of lines) {
  const idM = line.match(/id:\s*["']([^"']+)["']/);
  if (idM) current.id = idM[1];
  const nameM = line.match(/name:\s*["']([^"']+)["']/);
  if (nameM) current.name = nameM[1];
  const emojiM = line.match(/emoji:\s*["']([^"']+)["']/);
  if (emojiM) {
    current.emoji = emojiM[1];
    frames.push({...current});
    current = {};
  }
}

const emojiCounts = {};
for (const f of frames) {
  emojiCounts[f.emoji] = (emojiCounts[f.emoji] || 0) + 1;
}

const duplicates = frames.filter(f => emojiCounts[f.emoji] > 1);
console.log('Duplicate count:', duplicates.length);
duplicates.forEach(d => console.log(`${d.id} (${d.name}): ${d.emoji}`));
