const fs = require('fs');

let fileContent = fs.readFileSync('./src/data/avatarFramesData.ts', 'utf8');

const replacements = [
  { id: 'fr-quantum-core', from: 'emoji: "⚛️"', to: 'emoji: "🔬"' },
  { id: 'fr-ai-singularity', from: 'emoji: "🧠"', to: 'emoji: "🌐"' },
  { id: 'fr-diamond-tiara', from: 'emoji: "💍"', to: 'emoji: "💎"' },
  { id: 'fr-ancient-rune', from: 'emoji: "🪨"', to: 'emoji: "🗿"' },
];

for (const r of replacements) {
  const blockStart = fileContent.indexOf(`id: "${r.id}"`);
  if (blockStart !== -1) {
    const nextId = fileContent.indexOf('id: "', blockStart + 10);
    const blockEnd = nextId === -1 ? fileContent.length : nextId;
    const block = fileContent.slice(blockStart, blockEnd);
    const updatedBlock = block.replace(r.from, r.to);
    fileContent = fileContent.slice(0, blockStart) + updatedBlock + fileContent.slice(blockEnd);
  }
}

fs.writeFileSync('./src/data/avatarFramesData.ts', fileContent, 'utf8');
console.log('100% unique emojis applied!');
