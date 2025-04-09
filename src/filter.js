const fs = require('fs');
const csv = require('csv-parser');

let profanityWords = [];

function loadProfanityWords() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('profanity.csv')
      .pipe(csv())
      .on('data', (row) => {
        profanityWords.push({ word: row.word, severity: row.severity || 'PROFANE' });
      })
      .on('end', () => {
        resolve(profanityWords);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function add(word, severity = 'PROFANE') {
  const validSeverities = ['PROFANE', 'SEXUAL', 'OFFENSIVE'];
  const severityMatch = severity.toUpperCase().match(/^SEVERITY:(\w+)$/);
  
  if (severityMatch) {
    severity = severityMatch[1].toUpperCase();
  }

  if (!validSeverities.includes(severity)) {
    console.error(`Invalid severity: ${severity}. Valid severities are: ${validSeverities.join(', ')}`);
    return;
  }

  profanityWords.push({ word, severity });
}

function filterText(text) {
  let filteredText = text;

  profanityWords.forEach(({ word }) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}

module.exports = { loadProfanityWords, add, filterText };
