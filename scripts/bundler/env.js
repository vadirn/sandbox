const { makeResolve } = require('./utils');

// project root
exports.resolve = makeResolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const mode = (args.includes('--production') && 'production') || 'development';

exports.watch = watch;
exports.mode = mode;
exports.isProduction = mode === 'production';
exports.isDevelopment = mode === 'development';
