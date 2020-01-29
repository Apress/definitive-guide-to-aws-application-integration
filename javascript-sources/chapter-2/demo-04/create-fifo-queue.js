const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_dev'});

let sqs = new AWS.SQS();

var params = {
  QueueName: 'fifo-queue-2.fifo',
  Attributes: {
    'FifoQueue' : 'true'
  }
};

sqs.createQueue(params).promise().then(data => console.log(data))
.catch(err => console.log(err));