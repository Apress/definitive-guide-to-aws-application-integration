const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();

let input = {
    domain: "RestaurantDomain",
    taskList: {
        name: "OrderTasks"
    },
    maximumPageSize: 250,
    reverseOrder: true
};


function orchestrate(user_id, order_time, events, task_token) {
    let completedActivity = "";

    function generateDecision(activityName) {
        return {
            decisionType: "ScheduleLambdaFunction",
            scheduleLambdaFunctionDecisionAttributes: {
                id: '' + Math.random(),
                name: 'arn:aws:lambda:us-west-2:495525968791:function:lambda-activity',
                input: JSON.stringify({
                    user_id: user_id,
                    order_time: order_time
                })
            }
        };
    }

    for (let index in events) {
        let attributes = events[index].eventType.activityTaskCompletedEventAttributes;
        if (attributes) {
            completedActivity = attributes.activityType.name;
            break;
        }
    }

    let decision = {};
    switch (completedActivity) {
        case "" : decision = generateDecision("Prep"); break;
        case "Prep" : decision = generateDecision("Cook"); break;
        case "Cook" : decision = generateDecision("Pack"); break;
        case "Pack" : decision = generateDecision("Ship"); break;
    }

    swf.respondDecisionTaskCompleted({
        taskToken: task_token,
        decisions: [decision]
    }).promise()
        .then(console.log('Activity task scheduled'));
}

swf.pollForDecisionTask(input).promise()
    .then(data => {
        if(data.workflowExecution) {
            let parts = data.workflowExecution.workflowId.split("_");
            let user_id = parts[0];
            let order_time = parts[1];
            orchestrate(user_id, order_time, data.events, data.taskToken)

        } else {
            console.log('Empty response when polling for decision tasks')
        }
    });

