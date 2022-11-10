
# Make sure you are logged in using AWS CLI on helsingborg AWS
# Make sure you have scan access for the table (can be added in AWS console)
# {
#    "Version": "2012-10-17",
#    "Statement": [
#        {
#            "Sid": "VisualEditor0",
#            "Effect": "Allow",
#            "Action": "dynamodb:Scan",
#            "Resource": "arn:aws:dynamodb:eu-west-1:165945531802:table/Advert-xftjmdsvevcw3gsh6nqxdvrqzu-release"
#        }
#    ]
# }

CURR="$(pwd)"
SCRIPT_DIR="$(dirname -- "$0")"
echo $CURR
echo $SCRIPT_DIR
cd $SCRIPT_DIR
echo $(pwd -P)

python3 ddb_to_es.py \
  --rn 'eu-west-1' --tn 'Advert-is7p4btb7ngbrnnxso2ukvdkv4-prod' --lf 'arn:aws:lambda:eu-west-1:165945531802:function:amplify-aterbruketwebapp--OpenSearchStreamingLambd-cLSKxc6wHG9H' \
  --esarn 'arn:aws:dynamodb:eu-west-1:165945531802:table/Advert-is7p4btb7ngbrnnxso2ukvdkv4-prod/stream/2022-01-04T13:36:58.159'

  cd "${CURR}"