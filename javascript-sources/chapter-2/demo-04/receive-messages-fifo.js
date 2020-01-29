const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();


let FIFO_QUEUE_URL = "https://sqs.us-west-2.amazonaws.com/495525968791/fifo-queue-2.fifo";

getMessage = function(number) {
  return {
    "QueueUrl": FIFO_QUEUE_URL,
    "MessageBody": "test message body" + number,
    "MessageGroupId": "Group-1",
    "MessageDeduplicationId": "id-" + number
  };
};

let p1 = sqs.sendMessage(getMessage(1)).promise();
let p2 = sqs.sendMessage(getMessage(2)).promise();
let p3 = sqs.sendMessage(getMessage(3)).promise();

Promise.all([p1, p2, p3]);

let params = {
  "QueueUrl": "https://sqs.us-west-2.amazonaws.com/495525968791/fifo-queue-2.fifo",
  "AttributeNames" : ["Body", "MessageGroupId"],
  "VisibilityTimeout" : 2,
  "WaitTimeSeconds" : 3
};

let promise1 = sqs.receiveMessage(params).promise();
let promise2 = sqs.receiveMessage(params).promise();
let promise3 = sqs.receiveMessage(params).promise();

var counter = 0;
for(var i = 0; i < 10; i++) {
  promise1.then(data => processMessage(data))
      .catch(error => processError(error));
}

processMessage = function(data) {
  if (data.Messages) {
    console.log(data.Messages[0].Body + ":" + data.Messages[0].Attributes.MessageGroupId);
    if (counter++ % 3 === 0) {
      let deleteMessageRequest = {
        QueueUrl: FIFO_QUEUE_URL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteMessageRequest).promise().then(data => console.log(data)).catch(err => console.log(err))
    }
  }
};

processError = function(error) {
  console.log(error, error.stack);
};