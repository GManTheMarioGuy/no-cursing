# no-cursing
no-cursing is a profanity filter for NodeJS.

(Please note this profanity filter is a WIP at the moment and doesnt have alot yet)

**DISCLAIMER:** Source files such as .csv files contain profanity. Viewer discretion is advised!

This is project open-source. Feel free to contribute!

# Install
Install with npm:

`npm install no-cursing` 

## Examples
Example of how this is used (also an example of how to use `add` to add words yourself)
```
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
```
