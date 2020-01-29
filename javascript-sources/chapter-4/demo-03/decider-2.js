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
                    user_id: user_id,
                    order_time: order_time
                })
            }
        };
    }

    let completedActivities = 0;
    for (let index in events)
        if (events[index].eventType === "ActivityTaskCompleted")
            completedActivities++;

    let decision = {};
    switch (completedActivities) {
        case 0: decision = generateDecision("Prep"); break;
        case 1: decision = generateDecision("Cook"); break;
        case 2: decision = generateDecision("Pack"); break;
        case 3: decision = generateDecision("Ship"); break;
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

