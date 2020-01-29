const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();

let params = {
  "QueueUrl": "https://sqs.us-west-2.amazonaws.com/495525968791/programmatic-queue-1",
  "AttributeNames": ["All"],
  "MessageAttributeNames": ["attrib1", "attrib2"]
};

let promise = sqs.receiveMessage(params).promise();

processMessage = function(data) {
  console.log(JSON.stringify(data));
};

processError = function(error) {
  console.log(error, error.stack);
};

promise.then(data => processMessage(data))
       .catch(error => processError(error));