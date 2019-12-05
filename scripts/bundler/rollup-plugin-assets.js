const path = require('path');
const fs = require('fs');

function filter(id) {
  return /\.(png|svg|jpg|gif|ico)$/.test(id);
}

module.exports = () => {
  return {
    resolveId(source, importer) {
      if (filter(source)) {
        return path.resolve(path.dirname(importer), source);
      }
    },
    load(id) {
      if (filter(id)) {
        const assetReferenceId = this.emitAsset(
          path.basename(id),
          fs.readFileSync(id)
        );
        return `export default import.meta.ROLLUP_ASSET_URL_${assetReferenceId};`;
      }
    },
  };
};
