[![CodeQL](https://github.com/FDMediagroep/fdmg-imgix-upload/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/FDMediagroep/fdmg-imgix-upload/actions/workflows/codeql-analysis.yml)

# IMGIX Upload

Upload images to IMGIX and output a JSON-file with mappings to the hashed filenames on IMGIX.

## Prerequisites

1. Node & NPM

## Getting started

### For users of this tool

1. Run `npm i -g @fdmg/imgix-upload` to install this CLI-tool globally.
1. Make sure the required environment variables are set
1. You can now use `fdmg-imgix-upload` from the command-line or use the shorthand `fiu`.
   - Run `fiu --help` to see the available options.

Alternatively:

1. Run `npm i -D @fdmg/imgix-upload` to install the tool for your project.
1. Make sure the required environment variables are set or available in an `.env` file.
1. `fdmg-imgix-upload` or `fiu` commands are now available in package.json scripts.

### For developers of this tool

1. Run `npm i` to install all dependencies
1. Run `npm run build` to build the development version of this application.
   - Alternatively run `npm run build:prod` to build the production version of this application.
1. Make sure the required environment variables are set or available in an `.env` file.
1. Run `npm start`

## Environment variables

The following environment are supported:

- ENVIRONMENT
- IMGIX_UPLOAD_AWS_DEFAULT_REGION=eu-west-1
- IMGIX_UPLOAD_RELATIVE_IMAGE_MAP_LOCATION=./imageMap.json
- IMGIX_UPLOAD_RELATIVE_IMAGE_FOLDER_LOCATION=./public
- IMGIX_UPLOAD_ACC_S3_API_KEY=<IMGIX S3 API key> (required)
- IMGIX_UPLOAD_ACC_S3_SECRET_KEY=<IMGIX S3 secret key> (required)
- IMGIX_UPLOAD_ACC_S3_BUCKET_URL=<IMGIX S3 Bucket URL> (required)
- IMGIX_UPLOAD_ACC_S3_BUCKET=<IMGIX S3 Bucket name> (required)
- IMGIX_UPLOAD_ACC_S3_DISTRIBUTION_ID=<IMGIX CloudFront distribution ID>
- IMGIX_UPLOAD_DEV_S3_API_KEY=<IMGIX S3 API key> (required)
- IMGIX_UPLOAD_DEV_S3_SECRET_KEY=<IMGIX S3 secret key> (required)
- IMGIX_UPLOAD_DEV_S3_BUCKET_URL=<IMGIX S3 Bucket URL> (required)
- IMGIX_UPLOAD_DEV_S3_BUCKET=<IMGIX S3 Bucket name> (required)
- IMGIX_UPLOAD_DEV_S3_DISTRIBUTION_ID=<IMGIX CloudFront distribution ID>
- IMGIX_UPLOAD_PROD_S3_API_KEY=<IMGIX S3 API key> (required)
- IMGIX_UPLOAD_PROD_S3_SECRET_KEY=<IMGIX S3 secret key> (required)
- IMGIX_UPLOAD_PROD_S3_BUCKET_URL=<IMGIX S3 Bucket URL> (required)
- IMGIX_UPLOAD_PROD_S3_BUCKET=<IMGIX S3 Bucket name> (required)
- IMGIX_UPLOAD_PROD_S3_DISTRIBUTION_ID=<IMGIX CloudFront distribution ID>
- IMGIX_UPLOAD_S3_DATA_CACHE_CONTROL=max-age=15768000
