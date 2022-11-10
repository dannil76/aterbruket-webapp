python3 ddb_to_es.py \
  --rn 'eu-west-1' \ # Use the region in which your table and OpenSearch domain reside
  --tn 'Advert-is7p4btb7ngbrnnxso2ukvdkv4-prod' \ # Table name
  --lf 'arn:aws:lambda:us-west-2:123456789xxx:function:DdbToEsFn-<api__id>-dev' \ # Lambda function ARN, find the DdbToEsFn in your Lambda functions list, copy entire ARN
  --esarn 'arn:aws:dynamodb:eu-west-1:165945531802:table/Advert-is7p4btb7ngbrnnxso2ukvdkv4-prod/stream/2022-01-04T13:36:58.159' # Event source ARN, copy the full DynamoDB table ARN