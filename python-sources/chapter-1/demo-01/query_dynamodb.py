import boto3
from boto3.dynamodb.conditions import Key, Attr

session = boto3.Session(profile_name='admin')

dynamodb = session.resource("dynamodb", region_name="us-west-2")
table = dynamodb.Table('orders')

response = table.query(
    KeyConditionExpression=Key('user_id').eq('101') & Key('order_time').begins_with('2019')
)

print(response['Items'])