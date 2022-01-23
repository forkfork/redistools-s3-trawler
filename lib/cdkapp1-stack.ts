import { Stack, StackProps, Duration,
  aws_lambda as lambda, aws_s3 as s3,
  aws_s3_notifications as s3n,
  aws_elasticache as elasticache,
  aws_secretsmanager as secretsmanager,
  aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RedisDB } from 'cdk-redisdb';
import * as path from 'path';

import {
  aws_ec2 as ec2,
} from 'aws-cdk-lib';

/*
CHANGE region (ap-southeast-2) to one of 
ap-northeast-1
ap-southeast-2
eu-central-1
eu-west-1
us-east-1
us-east-2
us-west-2
See: https://aws-data-wrangler.readthedocs.io/en/stable/install.html#aws-lambda-layer
*/
const AWSWRANGLER_LAYER = 'arn:aws:lambda:ap-southeast-2:336392948345:layer:AWSDataWrangler-Python38:1';
/*
CHANGE S3_WATCH_BUCKET to match the bucket to watch for files in
*/
const S3_WATCH_BUCKET = 'tim-data-bucket';

export class Cdkapp1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    let vpc = new ec2.Vpc(this, 'Vpc', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public1',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'isolated1',
          subnetType: ec2.SubnetType.PRIVATE,
        },
      ],
    });
    let secret = new secretsmanager.Secret(this, 'redis-auth', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'myredisuser' }),
        generateStringKey: 'password',
        excludeCharacters: '@%*()_+=`~{}|[]\\:";\'?,./'
      }
    });
    const ecSecurityGroup = new ec2.SecurityGroup(this, 'elasticache-sg', {
      vpc: vpc,
      description: 'SecurityGroup associated with the ElastiCache Redis Cluster',
      allowAllOutbound: false,
    });
    let foo = new RedisDB(this, 'okstack', {
      existingVpc: vpc,
      existingSecurityGroup: ecSecurityGroup,
      nodeType: 'cache.m6g.large',
      replicas: 1,
      nodesCpuAutoscalingTarget: 60,
      authToken: secret.secretValueFromJson('password').toString(),
      transitEncryptionEnabled: true,
    });
    const bucket = s3.Bucket.fromBucketAttributes(this, 'bucket-to-watch',{
      bucketName: S3_WATCH_BUCKET
    });
    const customRole = new iam.Role(this, 'lambda-role', {
      roleName: 'lambdaCustomRole',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
      ]
    });
    const lambdaSecurityGroup = new ec2.SecurityGroup(this, 's3handler-lambda-sg', {
      vpc: vpc,
      description: 'SecurityGroup into which lambdas will be deployed',
    });
    const layer = lambda.LayerVersion.fromLayerVersionArn(this, 'wrangler-layer', 'arn:aws:lambda:ap-southeast-2:336392948345:layer:AWSDataWrangler-Python38:1');
    const lambdaFunction = new lambda.Function(this, 'lambda-fn', {
      runtime: lambda.Runtime.PYTHON_3_8,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE,
      },
      memorySize: 2048,
      timeout: Duration.minutes(15),
      handler: 'handlefile.lambda_handler',
      layers: [layer],
      code: lambda.Code.fromAsset(path.join(__dirname, '/../lambda')),
      securityGroups: [lambdaSecurityGroup],
      role: customRole,
      environment: {
        REDIS_HOST: foo.replicationGroup.attrConfigurationEndPointAddress,
        REDIS_PORT: foo.replicationGroup.attrConfigurationEndPointPort,
        SECRET_ARN: secret.secretArn,
      }
    });
    secret.grantRead(lambdaFunction);
    ecSecurityGroup.connections.allowFrom(lambdaSecurityGroup, ec2.Port.tcp(6379), 'Redis ingress 6379');
    ecSecurityGroup.connections.allowTo(lambdaSecurityGroup, ec2.Port.tcp(6379), 'Redis ingress 6379');
    bucket.grantRead(lambdaFunction);
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(lambdaFunction));
  }
}
