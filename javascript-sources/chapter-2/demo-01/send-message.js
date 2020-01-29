const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();

var params = {
  "QueueUrl": "https://sqs.us-west-2.amazonaws.com/495525968791/programmatic-queue-1",
  "MessageBody": "test message body",
  "DelaySeconds": 9,
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

sqs.sendMessage(params, function(err, data) {
  if (err)
    console.log(err, err.stack);
  else
    console.log(data);
});