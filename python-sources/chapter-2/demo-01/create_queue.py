import boto3

session = boto3.Session(profile_name='sqs_dev')

# Get the service resource
sqs = session.resource('sqs', region_name='us-west-2')

# Create the queue. This returns an SQS.Queue instance
queue = sqs.create_queue(QueueName='programmatic-queue-2', Attributes={'DelaySeconds': '5'})

# You can now access identifiers and attributes
print(queue.url)
print(queue.attributes.get('DelaySeconds'))