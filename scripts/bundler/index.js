const rollup = require('rollup');
const { watch, resolve, mode } = require('./env');
const { once } = require('./utils');
const { input, output } = require('./rollup.config');
const fs = require('fs-extra');
const { html, now } = require('./templates');

let watcher;

async function cleanup() {
  await fs.emptyDir(resolve('dist'));
  await fs.ensureDir(resolve('dist', 'assets'));
}

// returns systemjs filename
async function copySystemjs(mode = 'development') {
  const systemjsPath = resolve('node_modules', 'systemjs');
  const pkg = JSON.parse(
    await fs.readFile(resolve(systemjsPath, 'package.json'))
  );
  const filenames = {
    development: `system.${pkg.version}.js`,
    production: `system.${pkg.version}.min.js`,
  };
  if (mode === 'development') {
    await fs.copyFile(
      resolve(systemjsPath, 'dist', 's.js'),
      resolve('dist', 'assets', filenames.development)
    );
    return filenames.development;
  }
  await Promise.all([
    fs.copyFile(
      resolve(systemjsPath, 'dist', 's.min.js'),
      resolve('dist', 'assets', filenames.production)
    ),
    fs.copyFile(
      resolve(systemjsPath, 'dist', 's.min.js.map'),
      resolve('dist', 'assets', `${filenames.production}.map`)
    ),
  ]);
  return filenames.production;
}

const writeTemplates = once(assets => {
  fs.writeFile(
    resolve('dist', 'index.html'),
    html({
      assetsPath: '/assets',
      assets,
    })
  );
  fs.writeFile(resolve('dist', 'now.json'), now());
});

async function main() {
  await cleanup();
  const systemjs = await copySystemjs(mode);
  const assets = {
    'system.js': systemjs,
  };

  if (watch) {
    watcher = rollup.watch({
      ...input,
      output,
    });
    watcher.on('event', event => {
      (({
        START: () => console.log('Building...'),
        END: () => console.log('Finished building...'),
        ERROR: () => console.log('Error', { event }),
        FATAL: () => {
          console.log('Fatal error', { event });
          watcher.close();
          process.exit(-1);
        },
      }[event.code] || (() => {}))());
    });
    writeTemplates({ ...assets, 'main.js': 'main.js', 'main.css': 'main.css' });
  } else {
    console.log('Building...');
    try {
      const bundle = await rollup.rollup(input);
      const { output: bundleOutput } = await bundle.generate(output);
      // form assets object, here goes some guesswork
      for (const chunkOrAsset of bundleOutput) {
        if (
          chunkOrAsset.fileName.startsWith('main.') &&
          chunkOrAsset.fileName.endsWith('.js')
        ) {
          assets['main.js'] = chunkOrAsset.fileName;
        }
        if (
          chunkOrAsset.fileName.startsWith('main.') &&
          chunkOrAsset.fileName.endsWith('.css')
        ) {
          assets['main.css'] = chunkOrAsset.fileName;
        }
      }
      writeTemplates(assets);
      await bundle.write(bundleOutput);
    } catch (err) {
      if (err.filename && err.toString) {
        console.log(err.filename, err.toString());
      } else {
        console.log(err);
      }
    }
  }
}

process.on('exit', () => {
  console.log('Done. Exiting...');
});

process.on('SIGINT', () => {
  if (watcher) watcher.close();
  process.exit();
});

process.on('SIGTERM', () => {
  if (watcher) watcher.close();
  process.exit(0);
});

main();
