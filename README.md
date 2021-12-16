# IMGIX Upload

Upload images to IMGIX and output a JSON-file with mappings to the hashed filenames on IMGIX.

## Prerequisites

1. Node & NPM

## Getting started

1. Run `npm i` to install all dependencies
1. Run `npm run build` to build the development version of this application.
   - Alternatively run `npm run build:prod` to build the production version of this application.
1. Set the following environment are supported:
   - ENVIRONMENT
   - IMGIX_UPLOAD_AWS_DEFAULT_REGION=eu-west-1
   - IMGIX_UPLOAD_RELATIVE_IMAGE_MAP_LOCATION=./imageMap.json
   - IMGIX_UPLOAD_RELATIVE_IMAGE_FOLDER_LOCATION=./public
   - IMGIX_UPLOAD_ACC_S3_API_KEY=<IMGIX S3 API key>
   - IMGIX_UPLOAD_ACC_S3_SECRET_KEY=<IMGIX S3 secret key>
   - IMGIX_UPLOAD_ACC_S3_BUCKET_URL=<IMGIX S3 Bucket URL>
   - IMGIX_UPLOAD_ACC_S3_BUCKET=<IMGIX S3 Bucket name>
   - IMGIX_UPLOAD_ACC_S3_DISTRIBUTION_ID=<IMGIX CloudFront distribution ID>
   - IMGIX_UPLOAD_DEV_S3_API_KEY=<IMGIX S3 API key>
   - IMGIX_UPLOAD_DEV_S3_SECRET_KEY=<IMGIX S3 secret key>
   - IMGIX_UPLOAD_DEV_S3_BUCKET_URL=<IMGIX S3 Bucket URL>
   - IMGIX_UPLOAD_DEV_S3_BUCKET=<IMGIX S3 Bucket name>
   - IMGIX_UPLOAD_DEV_S3_DISTRIBUTION_ID=<IMGIX CloudFront distribution ID>
   - IMGIX_UPLOAD_PROD_S3_API_KEY=<IMGIX S3 API key>
   - IMGIX_UPLOAD_PROD_S3_SECRET_KEY=<IMGIX S3 secret key>
   - IMGIX_UPLOAD_PROD_S3_BUCKET_URL=<IMGIX S3 Bucket URL>
   - IMGIX_UPLOAD_PROD_S3_BUCKET=<IMGIX S3 Bucket name>
   - IMGIX_UPLOAD_PROD_S3_DISTRIBUTION_ID=<IMGIX CloudFront distribution ID>
   - IMGIX_UPLOAD_S3_DATA_CACHE_CONTROL=max-age=15768000
1. Run `npm start`
