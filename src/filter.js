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
    'a': /[4@/\-\\^λ]/g,
    'b': /[8|3ßI3J3]/g,
    'c': /[<\[]/g,
    'd': /[)|\]|Ð|1)]/g,
    'e': /[3&€\[]/g,
    'f': /[|=ƒ|#ph]/g,
    'g': /[69&(_+]/g,
    'h': /[#|-|}{\]-[(]/g,
    'i': /[1!|][eye]/g,
    'j': /[_|¿._|]/g,
    'k': /[X|<|{|(]/g,
    'l': /[|1|_|£¬]/g,
    'm': /[|\/|\/\\.|v]|^^|]V[|\/|]/g,
    'n': /[|\\|\/\[\<\\>\/V^И]/g,
    'o': /[0()[]°ø]/g,
    'p': /[|*|o|>|9|^]/g,
    'q': /[9|0_|(_,|<|¶]/g,
    'r': /[2|®|/2|12|I2|^|~|?]/g,
    's': /[5$z§ehs]/g,
    't': /[7+|-|1]['[]‡|«|»]/g,
    'u': /[|_|(_)L|vµ]/g,
    'v': /[\/^|\/|\\|]/g,
    'w': /[\/\/|vv|\N|'//|\\'|\\^\/|\|\/|uJ]/g,
    'x': /[><}{ecks×?)(][\/\|]/g,
    'y': /[\/'|j|\|\/|¥]/g,
    'z': /[2|7_|-\/_|~\/_/>_|-|_]/
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
