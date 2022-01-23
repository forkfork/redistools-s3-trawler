# Demo S3 Watcher

This project demonstrates watching an S3 bucket, and when a parquet file is placed within this bucket,
write the corresponding entries from S3 to Redis Elasticache.

Resources:

* A VPC and security groups
* A cluster mode Elasticache Replication Group
* An auth token created and stored in Secrets Manager, used as the Redis AUTH token
* An existing bucket onto which uploads will trigger a lambda
* A lambda built on the awswrangler layer which reads any S3 uploads and streams the parquet inside onto Redis

To use:

* npm install
* modify lib/cdkapp1-stack.ts (change bucket location, and region in lambda layer)
* set default region & local credentials, then run:

```
cd lambda; pip3 install -r requirements.txt -t .; cd .. # pip or pip3 as per your environment
cdk bootstrap
cdk deploy

Python code which reads parquet from s3 can be found in lambda/handlefile.py.

Error messages will still be a little misleading, still a bit of tidying up to do.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
