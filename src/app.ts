import { sha1FileSync } from "sha1-file";
import { getFiles } from "./utils/files";
import fs from "fs";
import ProgressBar from "progress";
import fileExtension from "file-extension";
import yargs from "yargs";
import zlib from "zlib";
import mime from "mime-types";
import AWS from "aws-sdk";
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
  bucket: {
    alias: "b",
    default: "fd-dev-public-images",
    description: "S3 bucket",
    requiresArg: true,
    required: false,
  },
  cacheControl: {
    alias: "c",
    default: "max-age=15768000",
    description: "cache-control header",
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
    default: "development",
    description: "Environment: development | acceptance | production",
    requiresArg: true,
    required: false,
  },
  imagesFolder: {
    alias: "i",
    default: "./public",
    description: "folder holding all the images",
    requiresArg: true,
    required: true,
  },
  outputImageMapLocation: {
    alias: "o",
    default: "./imageMap.json",
    description: "output image map file name",
    requiresArg: true,
    required: true,
  },
  region: {
    alias: "r",
    default: "eu-west-1",
    description: "AWS Region",
    requiresArg: true,
    required: false,
  },
  verbose: {
    alias: "v",
    description: "Debug",
    requiresArg: false,
    required: false,
  },
}).argv;

const Bucket = argv.bucket || process.env.IMGIX_UPLOAD_ACC_S3_BUCKET;
console.log(`S3 Bucket: ${Bucket}`);
const CacheControl =
  argv.cacheControl || process.env.IMGIX_UPLOAD_S3_DATA_CACHE_CONTROL;
console.log(`Cache-control: ${CacheControl}`);
console.log(`Dry-run: ${argv.dryRun}`);
const environment = argv.environment || process.env.ENVIRONMENT;
console.log(`Environment: ${environment}`);
const imagesFolder =
  argv.imagesFolder || process.env.IMGIX_UPLOAD_RELATIVE_IMAGE_FOLDER_LOCATION;
console.log(`Images folder: ${imagesFolder}`);
const imageMapLocation =
  argv.outputImageMapLocation ||
  process.env.IMGIX_UPLOAD_RELATIVE_IMAGE_MAP_LOCATION;
console.log(`Image map output location: ${imageMapLocation}`);
const region = argv.region || process.env.IMGIX_UPLOAD_AWS_DEFAULT_REGION;
console.log(`AWS Region: ${region}`);
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
let distributionId = process.env.IMGIX_UPLOAD_DEV_S3_DISTRIBUTION_ID;
switch (environment) {
  case "production":
    distributionId = process.env.IMGIX_UPLOAD_PROD_S3_DISTRIBUTION_ID;
    credentials.accessKeyId = process.env.IMGIX_UPLOAD_PROD_S3_API_KEY;
    credentials.secretAccessKey = process.env.IMGIX_UPLOAD_PROD_S3_SECRET_KEY;
    break;
  case "acceptance":
    distributionId = process.env.IMGIX_UPLOAD_ACC_S3_DISTRIBUTION_ID;
    credentials.accessKeyId = process.env.IMGIX_UPLOAD_ACC_S3_API_KEY;
    credentials.secretAccessKey = process.env.IMGIX_UPLOAD_ACC_S3_SECRET_KEY;
    break;
  case "development":
    distributionId = process.env.IMGIX_UPLOAD_DEV_S3_DISTRIBUTION_ID;
    credentials.accessKeyId = process.env.IMGIX_UPLOAD_DEV_S3_API_KEY;
    credentials.secretAccessKey = process.env.IMGIX_UPLOAD_DEV_S3_SECRET_KEY;
    break;
}

/**
 * Create S3 instance.
 */
const s3 = new AWS.S3({
  region: process.env.IMGIX_UPLOAD_AWS_DEFAULT_REGION,
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
      // Put object to S3.
      await s3
        .upload({
          Bucket,
          Body: compressedFile,
          CacheControl,
          Key: hashedFileName,
          ContentType,
          ContentEncoding: "gzip",
          ACL: "public-read",
        })
        .promise();
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
async function init(props: { imageMapLocation: string; imagesFolder: string }) {
  let ticks = 0;
  const files = await getFiles(
    props.imagesFolder.indexOf(".") === 0
      ? `${path.join(process.cwd(), props.imagesFolder)}`
      : props.imagesFolder
  );
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
      hashes[
        file.absolutePath.replace(process.cwd().replace(/\\/g, "/"), "")
      ] = `${sha1}.${ext}`;
      uploadToS3(file.absolutePath, `${sha1}.${ext}`);
    } catch (e) {
      console.error(e);
    }
  }
  if (debug) {
    console.log(hashes);
  }
  if (argv.dryRun) {
    console.log(
      `Dry-run: files not uploaded to S3 ${process.env.IMGIX_UPLOAD_DEV_S3_BUCKET_URL}`
    );
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
});
