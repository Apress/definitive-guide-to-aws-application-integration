const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();


var params = {
  QueueName: 'programmatic-queue-2',
  Attributes: {
    'DelaySeconds': '5'
  }
};
sqs.createQueue(params).promise()
    .then(data => modifyQueueAttributes(data))
    .catch(err => console.log(err));

function modifyQueueAttributes(createQueueResponse) {
  let url = createQueueResponse.QueueUrl;
  let reDrivePolicy = {
    deadLetterTargetArn: 'arn:aws:sqs:us-west-2:495525968791:orders_queue_dlq',
    maxReceiveCount: 150
  };

  let params = {
    QueueUrl: url,
    Attributes: {
      'DelaySeconds': '5',
      'RedrivePolicy' : JSON.stringify(reDrivePolicy)
    }
  };

  sqs.setQueueAttributes(params).promise()
      .then(data => console.log(data))
      .catch(err => console.log(err));
}