const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();

const params = {
    domain: "Order_domain_2",
    name: "order_workflow",
    version: "0.6",
    defaultTaskList: {
        name: "OrderSteps"
    },
    defaultTaskStartToCloseTimeout: 300,
    defaultExecutionStartToCloseTimeout: "1800"
};

swf.registerWorkflowType(params).promise()
    .then(response => console.log(response))
    .catch(err => console.log(err));

