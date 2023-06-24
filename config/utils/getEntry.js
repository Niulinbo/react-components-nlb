const path = require("path");
const fs = require('fs');

const componentsDir = path.resolve(__dirname, "../../src/module")
const componentsFiles = fs.readdirSync(componentsDir);
const componentsName = componentsFiles.filter(file => fs.statSync(`${componentsDir}/${file}`).isDirectory())
const componentsEntry = componentsName.reduce((result, name) => ({ ...result, [name]: `${componentsDir}/${name}` }), {})
console.log('componentsEntry', componentsEntry);

module.exports = componentsEntry
