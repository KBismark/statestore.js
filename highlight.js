const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['markdown']);

// The code snippet you want to highlight, as a string
const code = `npm install 'statestorejs'`;

// Returns a highlighted HTML string
const html = Prism.highlight(code, Prism.languages.markdown, 'markdown');

console.log(html);

