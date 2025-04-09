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

  const substitutions = {
    'a': /[4@]/g,
    'b': /[8]/g,
    'c': /[<]/g,
    'e': /[3]/g,
    'f': /[ph]/g,
    'g': /[9]/g,
    'i': /[1!|]/g,
    'l': /[|1]/g,
    'o': /[0()]/g,
    's': /[5$]/g,
    't': /[7+]/g,
    'z': /[2]/g,
    '0': /[oO]/g,
    '1': /[il|!]/g,
    '2': /[z]/g,
    '3': /[e]/g,
    '4': /[a@]/g,
    '5': /[s$]/g,
    '7': /[t]/g,
    '!': /[i|l|1]/g,
    '@': /[a]/g,
    '$': /[s]/g,
    '|': /[l]/g,
    '(': /[o]/g,
    ')': /[o]/g,
    '+': /[t]/g,
    '=': /[e]/g,
    '[': /[l]/g,
    ']': /[t]/g,
    '{': /[c]/g,
    '}': /[d]/g,
    '\\': /[m]/g,
    ';': /[j]/g,
    ':': /[i]/g,
    '"': /[a]/g,
    "'": /[l]/g,
    ',': /[c]/g,
    '.': /[o]/g,
    '/': /[r]/g,
    '?': /[c]/g
  };

  profanityList.forEach(({ word }) => {
    const escapedWord = word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

    let pattern = escapedWord;

    for (const [original, regex] of Object.entries(substitutions)) {
      pattern = pattern.replace(original, `[${original}${regex.source.slice(1, -1)}]*`);
    }

    const regex = new RegExp(`${pattern}\\w*`, 'gi');
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}

module.exports = { loadProfanity, add, filterText };
