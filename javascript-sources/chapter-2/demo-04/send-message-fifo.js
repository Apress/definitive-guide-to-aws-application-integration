const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();

var params = {
  "QueueUrl": "https://sqs.us-west-2.amazonaws.com/495525968791/fifo-queue-2.fifo",
  "MessageBody": "test message body13",
    "MessageGroupId": "Group-1",
  "MessageDeduplicationId": "id-1",
  "MessageAttributes": {
    "attrib1": {
      "DataType": "String",
      "StringValue": "value1"
    },
    "attrib2": {
      "DataType": "String",
      "StringValue": "value1"
    }
  }
};

sqs.sendMessage(params).promise()
    .then(data => console.log(data))
    .catch(err => console.log(err));


