import { glob } from "glob";
/**
 * Helper function to recursively retrieve fileName and relativePath
 * of all the files in given location (dir).
 */
export async function getFiles(dir: string) {
  const promise = new Promise<{ fileName: string; absolutePath: string }[]>(
    (resolve, reject) => {
      const results: { fileName: string; absolutePath: string }[] = [];
      glob(
        `${dir}/**/*`,
        { nodir: true, absolute: true },
        function (er, files) {
          if (er) {
            reject();
          }
          files.forEach((absolutePath) => {
            const pathSplits = absolutePath.split("/");
            results.push({
              fileName: pathSplits[pathSplits.length - 1],
              absolutePath,
            });
          });
          resolve(results);
        }
      );
    }
  );
  return promise;
}
