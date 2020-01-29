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

deleteMessage = function(handle) {
  let deletePromise = sqs.deleteMessage({
    QueueUrl: QUEUE_URL,
    ReceiptHandle: handle
  }).promise();
  deletePromise.then(data => console('Message successfully removed'))
               .catch(error => console.log(error, error.stack))
};

processData = function(data) {
  let messages = data.Messages;
  if (messages && messages.size > 0) {
    let handle = messages[0].ReceiptHandle;
    console.log('Message Received');
    deleteMessage(handle);
  } else {
    console.log('No Messages');
  }
};

let receivePromise = sqs.receiveMessage(receiveMessageRequest).promise();
receivePromise.then(data => processData(data))
  .catch(error => console.log(error, error.stack));



