const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();

let input = {
    domain: "RestaurantDomain",
    taskList: {
        name: "OrderTasks"
    },
    reverseOrder: true
};

function orchestrate(order, task_token) {
    let decision = {};

    function generateDecision(activityName) {
        return {
            decisionType: "ScheduleActivityTask",
            scheduleActivityTaskDecisionAttributes: {
                activityId: activityName + "_" + Math.random(),
                activityType: {
                    name: activityName,
                    version: "0.3"
                },
                input: JSON.stringify({
                    user_id: order.user_id,
                    order_time: order.order_time
                })
            }
        };
    }

    if (order.order_status === 'Confirmed') {
        decision = generateDecision("Prep");
    } else if (order.order_status === 'PREPARED') {
        decision = generateDecision("Cook");
    } else if (order.order_status === 'COOKED') {
        decision = generateDecision("Pack");
    } else if (order.order_status === 'PACKED') {
        decision = generateDecision("Ship");
    }

    swf.respondDecisionTaskCompleted({
        taskToken: task_token,
        decisions: [decision]
    }).promise()
        .then(console.log('Activity task scheduled'));
}

function handleOrder(userId, order_time, task_token) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    let query_input = {
        TableName : "orders",
        KeyConditionExpression: "user_id = :id and order_time = :ts",
        ExpressionAttributeValues: {
            ":id":userId,
            ":ts":order_time
        }
    };

    docClient.query(query_input).promise()
        .then(data => orchestrate(data.Items[0], task_token));
}

swf.pollForDecisionTask(input).promise()
    .then(data => {
        if(data.workflowExecution) {
            let parts = data.workflowExecution.workflowId.split("_");
            let userId = parts[0]
            let order_time = parts[1]
            handleOrder(userId, order_time, data.taskToken);
        } else {
            console.log('Empty response when polling for decision tasks')
        }
    });

