import json
import decimal
import boto3
import datetime
import time


def lambda_handler(event, context):
    session = boto3.Session()
    dynamodb = session.resource("dynamodb")
    table = dynamodb.Table('orders')
    ts = time.time()

    item = {
        'user_id': event['user_id'],
        'order_time': datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'),
        'total_amount': decimal.Decimal(str(event['total_amount']))
    }

    table.put_item(Item=item)
    return {
        'statusCode': 200,
        'body': json.dumps('Inserted order successfully')
    }




