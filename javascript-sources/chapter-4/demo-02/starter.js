const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();

let params = {
    domain: "RestaurantDomain",
    workflowId: "prog-run-01",
    workflowType: {
        name: "OrderWorkflow",
        version: "0.1"
    } ,
    taskList: {
        name: "OrderTasks"
    },
    input: "OrderID",
    executionStartToCloseTimeout: "300",
    taskStartToCloseTimeout: "60"
};

swf.startWorkflowExecution(params).promise()
    .then(data => console.log(data))
    .catch(err => console.log(err));