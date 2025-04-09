const { loadProfanityWords, add, filterText } = require('no-cursing');

(async () => {
  try {
    await loadProfanityWords();
    add('123', 'SEVERITY:PROFANE');
    const inputText = "This is a test with 123 in it.";
    const sanitizedText = filterText(inputText);
    console.log(sanitizedText);
  } catch (error) {
    console.error('Error:', error);
  }
})();
