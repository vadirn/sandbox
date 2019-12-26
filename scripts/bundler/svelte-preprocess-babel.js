const babel = require('@babel/core');

module.exports = async (content = '') =>
  babel.transformAsync(content, {
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  });
