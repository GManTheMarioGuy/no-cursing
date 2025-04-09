const fs = require('fs');
const csv = require('csv-parser');

function loadProfanityWords() {
  return new Promise((resolve, reject) => {
    const profanityWords = [];

    fs.createReadStream('profanity.csv')
      .pipe(csv())
      .on('data', (row) => {
        profanityWords.push(row.word);
      })
      .on('end', () => {
        resolve(profanityWords);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function filterText(text, profanityWords) {
  let filteredText = text;
  profanityWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });
  return filteredText;
}

async function run() {
  try {
    const profanityWords = await loadProfanityWords();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
