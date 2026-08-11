const IMPORT_META_URL = /import\.meta\.url/g;
const IMPORT_META = /import\.meta\b/g;

/**
 * Webpack cannot keep `import.meta` intact while bundling ESM dependencies into
 * a CommonJS bundle, and both of its fallbacks are broken at runtime:
 * `import.meta.url` becomes a string literal holding the build machine's path
 * (a Linux build then throws ERR_INVALID_FILE_URL_PATH on Windows, where a
 * POSIX path has no drive letter), and a standalone `import.meta` becomes an
 * object literal referencing the undefined `__webpack_module__`.
 *
 * Provide an equivalent that is resolved at runtime instead.
 */
module.exports = function importMetaUrlLoader(source) {
  IMPORT_META.lastIndex = 0;
  if (!IMPORT_META.test(source)) {
    return source;
  }

  const patched = source
    .replace(IMPORT_META_URL, "__importMetaUrl")
    .replace(IMPORT_META, "__importMeta");

  const preamble = [
    'import { pathToFileURL as __pathToFileURL } from "node:url";',
    "const __importMetaUrl = __pathToFileURL(__filename).href;",
  ];
  if (patched.includes("__importMeta.")) {
    preamble.push(
      'import { createRequire as __createRequire } from "node:module";',
      "const __importMeta = {",
      "  url: __importMetaUrl,",
      "  resolve: (specifier) =>",
      "    __createRequire(__importMetaUrl).resolve(specifier),",
      "};"
    );
  }

  return [...preamble, patched].join("\n");
};
