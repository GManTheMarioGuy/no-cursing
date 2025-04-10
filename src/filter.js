const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const packageDir = path.dirname(require.resolve('no-cursing/package.json'));
const profanityFilePath = path.join(packageDir, 'src', 'profanity.csv');

let profanityList = [];

function loadProfanity() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(profanityFilePath)
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

function createSubstitutionRegex(word) {
  const substitutionMap = {
    a: '[a@4]',
    b: '[b8]',
    c: '[c<]',
    d: '[d]',
    e: '[e3]',
    f: '[f]',
    g: '[g6]',
    h: '[h]',
    i: '[i1!]',
    j: '[j]',
    k: '[k]',
    l: '[l1|]',
    m: '[m]',
    n: '[n]',
    o: '[o0]',
    p: '[p]',
    q: '[q]',
    r: '[r]',
    s: '[s$5]',
    t: '[t7+]',
    u: '[u]',
    v: '[v]',
    w: '[w]',
    x: '[x]',
    y: '[y]',
    z: '[z2]'
  };

  return word
    .split('')
    .map((char) => substitutionMap[char.toLowerCase()] || char)
    .join('');
}

function filterText(text) {
  let filteredText = text;

  profanityList.forEach(({ word }) => {
    const escapedWord = word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
    const regexString = createSubstitutionRegex(escapedWord);
    const regex = new RegExp(`${regexString}\\w*`, 'gi');
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}

module.exports = { loadProfanity, add, filterText };
