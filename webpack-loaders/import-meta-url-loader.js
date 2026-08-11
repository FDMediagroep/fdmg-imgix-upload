const IMPORT_META_URL = /import\.meta\.url/g;

/**
 * Webpack evaluates `import.meta.url` at build time and inlines the absolute
 * path of the build machine. yargs feeds that value to `fileURLToPath()` and
 * `createRequire()`, so a bundle built on Linux throws
 * ERR_INVALID_FILE_URL_PATH when it runs on Windows (a POSIX path has no drive
 * letter). Resolve the URL at runtime instead.
 */
module.exports = function importMetaUrlLoader(source) {
  if (!IMPORT_META_URL.test(source)) {
    return source;
  }
  return [
    'import { pathToFileURL as __importMetaUrlLoaderPathToFileURL } from "node:url";',
    "const __importMetaUrl = __importMetaUrlLoaderPathToFileURL(__filename).href;",
    source.replace(IMPORT_META_URL, "__importMetaUrl"),
  ].join("\n");
};
