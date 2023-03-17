import { glob } from "glob";
/**
 * Helper function to recursively retrieve fileName and relativePath
 * of all the files in given location (dir).
 */
export async function getFiles(dir: string) {
  const results: { fileName: string; absolutePath: string }[] = [];
  try {
    const files = await glob(`${dir}/**/*`, {
      nodir: true,
      absolute: true,
    });
    files.forEach((absolutePath) => {
      const pathSplits = absolutePath.split("/");
      results.push({
        fileName: pathSplits[pathSplits.length - 1],
        absolutePath,
      });
    });
  } catch (e) {
    throw e;
  }
  return results;
}
