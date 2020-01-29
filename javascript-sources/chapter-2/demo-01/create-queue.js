const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();

var params = {
  QueueName: 'programmatic-queue-1',
  Attributes: {
    'DelaySeconds': '5'
  }
};
sqs.createQueue(params, function(err, data) {
  if (err)
    console.log(err, err.stack);
  else
    console.log(data);
});