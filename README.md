# no-cursing
no-cursing is a profanity filter for NodeJS.

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
    const inputText = "This is a test with 123 in it.";
    const sanitizedText = filterText(inputText);
    console.log(sanitizedText);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```
