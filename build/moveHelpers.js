const { renameSync } = require("fs");

renameSync('./dist/helpers', './helpers')

console.log('Moved helpers out of dist/')