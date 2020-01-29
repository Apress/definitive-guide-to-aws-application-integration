import boto3

client = boto3.client('swf')
domain = 'test-01'
taskList = 'TestTasks'


def poll():
    task = client.poll_for_decision_task(
        domain=domain,
        taskList={
            'name': taskList
        }
    )
    print "Received a Decision task"
    return task


def decide(task):
    print "Making decision on what is next"
    startedEventId = task["startedEventId"]
    previousStartedEventId = task["previousStartedEventId"]
    nextActivity, activityId = findNextActivity(task, startedEventId)