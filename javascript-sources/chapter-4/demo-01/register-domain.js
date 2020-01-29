const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();

swf.registerDomain({
    name: 'Order_domain_2',
    workflowExecutionRetentionPeriodInDays: '10'
}).promise()
    .then(response => console.log(response))
    .catch(err => console.log(err));