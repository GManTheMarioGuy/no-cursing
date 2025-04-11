const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const packageDir = path.dirname(require.resolve('no-cursing/package.json'));
const wordsFilePath = path.join(packageDir, 'src', 'words.csv');

let wordList = [];

function loadWords() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(wordsFilePath)
      .pipe(csv())
      .on('data', (row) => {
        let level = row.level && row.level.toUpperCase() !== 'NONE' ? row.level.toUpperCase() : null;
        let isSafe = row.issafe && row.issafe.toLowerCase() === 'true' ? 'SAFE' : level;
        
        wordList.push({
          word: row.word,
          level: isSafe || 'PROFANE',
        });
      })
      .on('end', () => {
        resolve(wordList);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function add(word, level = 'PROFANE', isSafe = false) {
  const validLevels = ['PROFANE', 'SEXUAL', 'OFFENSIVE', 'SAFE'];

  if (isSafe) {
    level = 'SAFE';
  }

  const levelMatch = level.toUpperCase().match(/^LEVEL:(\w+)$/);
  if (levelMatch) {
    level = levelMatch[1].toUpperCase();
  }

  if (!validLevels.includes(level)) {
    console.error(`Invalid level: ${level}. Valid levels are: ${validLevels.join(', ')}`);
    return;
  }

  const index = wordList.findIndex((entry) => entry.word === word);
  if (index !== -1) {
    wordList[index].level = level;
  } else {
    wordList.push({ word, level });
  }
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

  wordList.forEach(({ word, level }) => {
    if (level === 'SAFE') return;

    const escapedWord = word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
    const regexString = createSubstitutionRegex(escapedWord);
    const regex = new RegExp(`${regexString}\\w*`, 'gi');
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}

module.exports = { loadWords, add, filterText };
