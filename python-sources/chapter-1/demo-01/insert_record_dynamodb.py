import decimal

import boto3

session = boto3.Session(profile_name='admin')

dynamodb = session.resource("dynamodb", region_name="us-west-2")
table = dynamodb.Table('orders')

item = {
    'user_id': "101",
    'order_time': "2019-03-31 00:00:00",
    'total_amount': decimal.Decimal('7.89')     # total_amount is a number, we should use decimals
}

table.put_item(Item=item)
