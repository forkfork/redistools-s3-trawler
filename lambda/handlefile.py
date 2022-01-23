import awswrangler as wr
import json
import urllib.parse
import boto3
import os
import numpy as np
from rediscluster import RedisCluster

def fetchRedisAuth():  
  secrets_client = boto3.client('secretsmanager')
  kwargs = {'SecretId': os.environ['SECRET_ARN']}
  response = secrets_client.get_secret_value(**kwargs)
  return json.loads(response['SecretString'])

secretvalues = fetchRedisAuth()

print("Connecting to redis", os.environ['REDIS_HOST'], "using port", os.environ['REDIS_PORT'])
r = RedisCluster(host=os.environ['REDIS_HOST'], 
  port=os.environ['REDIS_PORT'],
  decode_responses=True,
  skip_full_coverage_check=True,
  ssl=True,
  ssl_cert_reqs=False,
  password=secretvalues['password'])
s3 = boto3.client('s3')

class NpEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, np.integer):
      return int(obj)
    if isinstance(obj, np.floating):
      return float(obj)
    if isinstance(obj, np.ndarray):
      return obj.tolist()
    return super(NpEncoder, self).default(obj)

def lambda_handler(event, context):
  bucket = event['Records'][0]['s3']['bucket']['name']
  key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
  try:
    dfs = wr.s3.read_parquet('s3://' + bucket + '/' + key,
      chunked=1_000,
      pyarrow_additional_kwargs={"timestamp_as_object":True})
    # iterate through each parquet chunk 
    chunkCounter = 0
    for df in dfs:
      print('chunkCounter', chunkCounter)
      chunkCounter += 1_000 
      p = r.pipeline()
      # iterate through each row of chunk
      for row in df.itertuples(index=False):
        obj = {}
        # create an object for serialization from the tuple
        for i, field in enumerate(row._fields):
          obj[row._fields[i]] = row[i]
        # serialize and set
        serialized = json.dumps(obj,cls=NpEncoder, default=str)
        p.set(int(row.id), serialized)
      # when using pipelines with redis-py-cluster, sharding is handled automagically
      p.execute()
    print('completed all rows')
    return
  except Exception as e:
    print(e)
    print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
    raise e
