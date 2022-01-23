# Demo S3 Watcher

This project demonstrates watching an S3 bucket, and when a parquet file is placed within this bucket,
write the corresponding entries from S3 to Redis Elasticache.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
