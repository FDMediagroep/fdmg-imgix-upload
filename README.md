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
   - IMGIX_UPLOAD_AWS_DEFAULT_REGION
   - IMGIX_UPLOAD_RELATIVE_IMAGE_MAP_LOCATION
   - IMGIX_UPLOAD_RELATIVE_IMAGE_FOLDER_LOCATION
   - IMGIX_UPLOAD_ACC_S3_API_KEY
   - IMGIX_UPLOAD_ACC_S3_SECRET_KEY
   - IMGIX_UPLOAD_ACC_S3_BUCKET_URL
   - IMGIX_UPLOAD_ACC_S3_BUCKET
   - IMGIX_UPLOAD_ACC_S3_DISTRIBUTION_ID
   - IMGIX_UPLOAD_DEV_S3_API_KEY
   - IMGIX_UPLOAD_DEV_S3_SECRET_KEY
   - IMGIX_UPLOAD_DEV_S3_BUCKET_URL
   - IMGIX_UPLOAD_DEV_S3_BUCKET
   - IMGIX_UPLOAD_DEV_S3_DISTRIBUTION_ID
   - IMGIX_UPLOAD_PROD_S3_API_KEY
   - IMGIX_UPLOAD_PROD_S3_SECRET_KEY
   - IMGIX_UPLOAD_PROD_S3_BUCKET_URL
   - IMGIX_UPLOAD_PROD_S3_BUCKET
   - IMGIX_UPLOAD_PROD_S3_DISTRIBUTION_ID
   - IMGIX_UPLOAD_S3_DATA_CACHE_CONTROL
1. Run `npm start`
