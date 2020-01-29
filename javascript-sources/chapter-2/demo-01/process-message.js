const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();
let QUEUE_URL = 'https://sqs.us-west-2.amazonaws.com/495525968791/programmatic-queue-1';

let receiveMessageRequest = {
  QueueUrl: QUEUE_URL,
  MaxNumberOfMessages: 1,
  WaitTimeSeconds: 20
};

let deleteMessageRequest = {
  QueueUrl: QUEUE_URL,
  ReceiptHandle: handle
};

sqs.receiveMessage(receiveMessageRequest, function(err, data) {
  if (err)
    console.log(err, err.stack);
  else if(data.Messages && data.Messages.size > 0) {
    let message = data.Messages[0];
    let handle = message.ReceiptHandle;
    console.log('Message processed successfully');
    sqs.deleteMessage(deleteMessageRequest, function(err, data) {
      if(err)
        console.log(err, err.stack);
      else
        console.log('Message removed successfully')
    });
  }
});