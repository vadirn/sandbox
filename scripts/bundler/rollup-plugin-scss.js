const path = require('path');
const sass = require('node-sass');
const Concat = require('concat-with-sourcemaps');
const { promisify } = require('util');
const postcss = require('postcss');
const cssnano = require('cssnano');

const render = promisify(sass.render.bind(sass));

async function minify(mode, code, map, { from, to } = {}) {
  if (mode === 'production') {
    const res = await postcss([cssnano]).process(code, {
      from,
      to,
      map: { prev: map, inline: false },
    });
    return {
      code: res.css,
      map: res.map.toString(),
    };
  }
  return {
    code,
    map,
  };
}

module.exports = ({ mode, renderOptions = {} } = {}) => {
  const extracted = new Map();

  return {
    name: 'scss',
    async transform(code, id) {
      if (!/\.(css|scss)$/.test(id)) {
        return null;
      }

      const res = await render({
        ...renderOptions,
        file: id,
        data: code,
        sourceMap: mode === 'development',
        includePaths: renderOptions.includePaths || [],
      });

      for (const dep of res.stats.includedFiles) {
        this.addWatchFile(dep);
      }

      extracted.set(id, {
        id,
        code: res.css.toString(),
        map: res.map && res.map.toString(),
      });

      return {
        code: '',
        map: { mappings: '' },
      };
    },
    async generateBundle(outputOptions, bundle) {
      if (extracted.size === 0) return;

      // figure out output css filename
      const dir = outputOptions.dir;
      const entry = path.join(
        dir,
        Object.keys(bundle).find(fileName => bundle[fileName].isEntry)
      );
      const fileName = `${path.basename(entry, path.extname(entry))}.css`;

      // sort entries
      const { modules } = bundle[path.relative(dir, entry)];
      const entries = Array.from(extracted.values());
      if (modules) {
        const fileList = Object.keys(modules);
        // sort
        entries.sort((a, b) => fileList.indexOf(b.id) - fileList.indexOf(a.id));
      }

      // concat
      const concat = new Concat(true, fileName, '\n');
      for (const res of entries) {
        const resRelative = path.relative(dir, res.id);
        const map = res.map || null;
        if (map) {
          map.file = fileName;
        }
        concat.add(resRelative, res.code, map);
      }

      const res = await minify(
        mode,
        `${concat.content}\n/*# sourceMappingURL=${fileName}.map */`,
        concat.sourceMap.toString(),
        { from: fileName, to: fileName }
      );

      this.emitFile({ fileName, type: 'asset', source: res.code });
      if (res.map) {
        this.emitFile({
          fileName: `${fileName}.map`,
          type: 'asset',
          source: res.map,
        });
      }

      // bundle[fileName] = {
      //   [fileName]: { fileName, isAsset: true, source: res.code },
      // };
    },
  };
};
