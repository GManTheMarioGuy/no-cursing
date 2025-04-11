const { loadWords, add, filterText } = require('no-cursing');

(async () => {
  try {
    await loadWords();
    add('123', 'PROFANE');
    add('1234', 'SEXUAL');
    add('12345', 'OFFENSIVE');
    add('123456', 'SAFE');
    const inputText = "This is a test with 123, 1234, 12345, and 123456 in it.";
    const sanitizedText = filterText(inputText);
    console.log(sanitizedText);
  } catch (error) {
    console.error('Error:', error);
  }
})();
