const { loadProfanity, add, filterText } = require('no-cursing');

(async () => {
  try {
    await loadProfanity();
    add('123', 'SEVERITY:PROFANE');
    add('1234', 'SEVERITY:SEXUAL');
    add('12345', 'SEVERITY:OFFENSIVE');
    const inputText = "This is a test with 123, 1234, and 12345 in it.";
    const sanitizedText = filterText(inputText);
    console.log(sanitizedText);
  } catch (error) {
    console.error('Error:', error);
  }
})();
