const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();

let params = {
    "domain": "Order_domain_2",
    "name": "prep_task_2",
    "version": "v1",
    "defaultTaskStartToCloseTimeout": "1800",
    "defaultTaskHeartbeatTimeout": "300",
    "defaultTaskScheduleToStartTimeout": "300",
    "defaultTaskScheduleToCloseTimeout": "2100"
};

swf.registerActivityType(params).promise()
    .then(response => console.log(response))
    .catch(err => console.log(err));