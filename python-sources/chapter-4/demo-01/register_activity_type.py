import boto3

client = boto3.client('swf')

response = client.register_activity_type(
    domain='Order_domain_2',
    name='prep_task_2',
    version='v3',
    defaultTaskStartToCloseTimeout='1800',
    defaultTaskHeartbeatTimeout='300',
    defaultTaskList={
        'name': 'order_tasks'
    },
    defaultTaskScheduleToStartTimeout='300',
    defaultTaskScheduleToCloseTimeout='2100'
)

print response

client.start_workflow_execution()