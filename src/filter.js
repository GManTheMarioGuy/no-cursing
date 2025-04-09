const fs = require('fs');
const csv = require('csv-parser');

let profanityList = [];

function loadProfanity() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('src/profanity.csv')
      .pipe(csv())
      .on('data', (row) => {
        profanityList.push({ word: row.word, severity: row.severity || 'PROFANE' });
      })
      .on('end', () => {
        resolve(profanityList);
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

  profanityList.push({ word, severity });
}

function filterText(text) {
  let filteredText = text;

  profanityList.forEach(({ word }) => {
    const escapedWord = word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
    const regex = new RegExp(`${escapedWord}\\w*`, 'gi');
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}

module.exports = { loadProfanity, add, filterText };
