import { sha1FileSync } from "sha1-file";
import { getFiles } from "./utils/files";
import fs from "fs";
import ProgressBar from "progress";
import fileExtension from "file-extension";
import yargs from "yargs";
import zlib from "zlib";
import mime from "mime-types";
import { Upload } from "@aws-sdk/lib-storage";
import { ObjectCannedACL, S3 } from "@aws-sdk/client-s3";
import path from "path";

declare let process: any;
type Hashes = {
  [relativePath: string]: string;
};

/**
 * Setup command-line options.
 * Run `node <app> --help` to list all the options.
 */
const argv: any = yargs(process.argv.slice(2)).options({
  acl: {
    description:
      "access control lists e.g.: authenticated-read | aws-exec-read | bucket-owner-full-control | bucket-owner-read | private | public-read | public-read-write | none. Default: public-read",
    requiresArg: true,
    required: false,
  },
  bucket: {
    alias: "b",
    description: "S3 bucket",
    requiresArg: true,
    required: false,
  },
  cacheControl: {
    alias: "c",
    description: "cache-control header e.g.: max-age=15768000",
    requiresArg: true,
    required: false,
  },
  dryRun: {
    alias: "d",
    description:
      "Dry-run will run the tool without uploading files or writing outputs",
    requiresArg: false,
    required: false,
  },
  environment: {
    alias: "e",
    description: "Environment: development | acceptance | production",
    requiresArg: true,
    required: false,
  },
  imagesFolder: {
    alias: "i",
    description: "folder holding all the images e.g.: ./public",
    requiresArg: true,
    required: true,
  },
  outputImageMapLocation: {
    alias: "o",
    description: "output image map file name e.g.: ./imageMap.json",
    requiresArg: true,
    required: true,
  },
  region: {
    alias: "r",
    description: "AWS Region e.g: eu-west-1",
    requiresArg: true,
    required: false,
  },
  stripImagesFolder: {
    alias: "s",
    description: "Strip images folder from image map path as well",
    requiresArg: false,
    required: false,
  },
  verbose: {
    alias: "v",
    description: "Debug",
    requiresArg: false,
    required: false,
  },
}).argv;

function getBucket(environment: string) {
  let result = "";
  switch (environment) {
    case "development":
      result = process.env.IMGIX_UPLOAD_DEV_S3_BUCKET;
      break;
    case "acceptance":
      result = process.env.IMGIX_UPLOAD_ACC_S3_BUCKET;
      break;
    case "production":
      result = process.env.IMGIX_UPLOAD_PROD_S3_BUCKET;
      break;
  }
  return result;
}

let ACL: ObjectCannedACL | undefined = "public-read";
if (argv.acl && argv.acl !== "none") {
  ACL = argv.acl;
} else if (argv.acl === "none") {
  ACL = undefined;
}
console.log(`ACL: ${ACL}`);
const CacheControl =
  argv.cacheControl || process.env.IMGIX_UPLOAD_S3_DATA_CACHE_CONTROL;
console.log(`Cache-control: ${CacheControl}`);
console.log(`Dry-run: ${!!argv.dryRun}`);
const environment = argv.environment || process.env.ENVIRONMENT;
console.log(`Environment: ${environment}`);
const Bucket = argv.bucket || getBucket(environment);
console.log(`S3 Bucket: ${Bucket}`);
let imagesFolder =
  argv.imagesFolder || process.env.IMGIX_UPLOAD_RELATIVE_IMAGE_FOLDER_LOCATION;
imagesFolder =
  imagesFolder.indexOf(".") === 0
    ? `${path.join(process.cwd(), imagesFolder)}`
    : imagesFolder;
imagesFolder = imagesFolder.replace(/\\/g, "/");
console.log(`Images folder: ${imagesFolder}`);
const imageMapLocation =
  argv.outputImageMapLocation ||
  process.env.IMGIX_UPLOAD_RELATIVE_IMAGE_MAP_LOCATION;
console.log(`Image map output location: ${imageMapLocation}`);
const region = argv.region || process.env.IMGIX_UPLOAD_AWS_DEFAULT_REGION;
console.log(`AWS Region: ${region}`);
const stripImagesFolder = argv.stripImagesFolder;
console.log(`Strip images folder: ${stripImagesFolder}`);
const debug = argv.verbose;

if (debug) {
  console.log(`Verbose: ${argv.verbose}`);
  console.log(argv);
}

/**
 * Credentials and distribution id from environment variables
 */
const credentials = {
  accessKeyId: process.env.IMGIX_UPLOAD_DEV_S3_API_KEY,
  secretAccessKey: process.env.IMGIX_UPLOAD_DEV_S3_SECRET_KEY,
};
switch (environment) {
  case "production":
    credentials.accessKeyId = process.env.IMGIX_UPLOAD_PROD_S3_API_KEY;
    credentials.secretAccessKey = process.env.IMGIX_UPLOAD_PROD_S3_SECRET_KEY;
    break;
  case "acceptance":
    credentials.accessKeyId = process.env.IMGIX_UPLOAD_ACC_S3_API_KEY;
    credentials.secretAccessKey = process.env.IMGIX_UPLOAD_ACC_S3_SECRET_KEY;
    break;
  case "development":
    credentials.accessKeyId = process.env.IMGIX_UPLOAD_DEV_S3_API_KEY;
    credentials.secretAccessKey = process.env.IMGIX_UPLOAD_DEV_S3_SECRET_KEY;
    break;
}

/**
 * Create S3 instance.
 */
const s3 = new S3({
  region,
  credentials,
});

/**
 * Upload given file renamed to given hashed filename to the IMGIX S3 bucket.
 *
 * @param absolutePath Absolute path to the local file
 * @param hashedFileName the hashed filename used when uploading to the IMGIX S3 bucket.
 */
async function uploadToS3(absolutePath: string, hashedFileName: string) {
  const fileBuffer = fs.readFileSync(absolutePath);
  const compressedFile = zlib.gzipSync(fileBuffer);
  let ContentType =
    mime.contentType(absolutePath.replace(/\//g, "")) || undefined;
  if (!argv.dryRun) {
    try {
      if (debug) {
        console.log({
          Bucket,
          CacheControl,
          Key: hashedFileName,
          ContentType,
          ContentEncoding: "gzip",
          ACL,
        });
      }
      // Put object to S3.
      await new Upload({
        client: s3,

        params: {
          Bucket,
          Body: compressedFile,
          CacheControl,
          Key: hashedFileName,
          ContentType,
          ContentEncoding: "gzip",
          ACL,
        },
      }).done();
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 *
 * @param props options
 * - `imageMapLocation`: relative output path for the image map
 * - `imagesFolder`: relative path to the root images folder
 */
async function init(props: {
  imageMapLocation: string;
  imagesFolder: string;
  stripImagesFolder: boolean;
}) {
  let ticks = 0;
  let files = await getFiles(props.imagesFolder);
  if (debug) {
    console.log(files);
  }
  const bar = new ProgressBar("Process files (:current/:total) :bar :etas", {
    total: files.length,
    width: 50,
  });
  const hashes: Hashes = {};
  for (const file of files) {
    ticks++;
    bar.tick({ counter: files.length - ticks });
    try {
      const sha1 = sha1FileSync(file.absolutePath);
      const ext = fileExtension(file.absolutePath);
      let fileLocation = file.absolutePath.replace(
        process.cwd().replace(/\\/g, "/"),
        ""
      );
      if (props.stripImagesFolder) {
        fileLocation = fileLocation.replace(
          argv.imagesFolder.replace(".", ""),
          ""
        );
      }
      hashes[fileLocation] = `${sha1}.${ext}`;
      await uploadToS3(file.absolutePath, `${sha1}.${ext}`);
    } catch (e) {
      console.error(e);
    }
  }
  if (debug) {
    console.log(hashes);
  }
  if (argv.dryRun) {
    console.log(`Dry-run: files not uploaded to S3 ${Bucket}`);
  }

  if (!argv.dryRun) {
    console.log(`Results saved in ${props.imageMapLocation}`);
    try {
      fs.writeFileSync(props.imageMapLocation, JSON.stringify(hashes, null, 2));
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`Dry-run: Results not saved in ${props.imageMapLocation}`);
  }
}

/**
 * Run `init` with either CLI-arguments or when absent use environment variables.
 */
init({
  imageMapLocation,
  imagesFolder,
  stripImagesFolder,
});
