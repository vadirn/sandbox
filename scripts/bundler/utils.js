const path = require('path');

exports.makeResolve = (...outer) => (...inner) =>
  path.resolve(...outer, ...inner);

exports.cli = () => {
  const args = process.argv.slice(2);
  const watch = args.includes('--watch');
  const build = args.includes('--build');
  const mode = (build && 'production') || 'development';
  return {
    mode,
    watch,
  };
};

exports.once = fn => {
  let done = false;
  let cachedReturn;

  return (...args) => {
    if (done === false) {
      done = true;
      cachedReturn = fn(...args);
    }
    return cachedReturn;
  };
};
