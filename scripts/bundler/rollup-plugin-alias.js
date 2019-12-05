const path = require('path');
const fs = require('fs');

const access = path => {
  return new Promise(resolve => {
    fs.access(path, fs.constants.F_OK | fs.constants.R_OK, err => {
      if (err) resolve();
      resolve(path);
    });
  });
};

module.exports = (options = {}) => {
  return {
    async resolveId(importee) {
      const alias = Object.keys(options).find(alias =>
        importee.startsWith(alias)
      );

      if (!alias) return;

      const basePath = importee.replace(alias, options[alias]);

      // we specifically know what file to expect, return it with no checks
      if (path.extname(basePath).length > 0) return basePath;

      // probably we are searching for index.mjs or index.js or index.svelte
      const existingFiles = await Promise.all([
        access(path.join(basePath, 'index.mjs')),
        access(path.join(basePath, 'index.js')),
        access(path.join(basePath, 'index.svelte')),
        access(`${basePath}.mjs`),
        access(`${basePath}.js`),
        access(`${basePath}.svelte`),
      ]);

      return existingFiles.find(Boolean);
    },
  };
};
