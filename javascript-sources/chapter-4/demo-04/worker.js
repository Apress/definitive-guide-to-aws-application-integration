const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

let swf = new AWS.SWF();
let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
let docClient = new AWS.DynamoDB.DocumentClient();

let input = {
    domain: "RestaurantDomain",
    taskList: {
        name: "PREP_LIST"
    },
};

async function prepareOrder (item) {

    if (item.order_status === 'CANCELLED') {
        return
    }

    let params = {
        TableName: "orders",
        Key: {
            user_id: { S: item.user_id },
            order_time: { S: item.order_time }
        },
        UpdateExpression: "set order_status = :val1",
        "ExpressionAttributeValues": {
            ":val1": {"S": "PREPARED"}
        },
    };
    console.log("Preparation Done, Saving the order");
    await ddb.updateItem(params).promise();
    console.log("Successfully prepared data");

}

function handle(order, task_token) {
    console.log("Fetching the order.... ");

    let query_input = {
        TableName : "orders",
        KeyConditionExpression: "user_id = :id and order_time = :ts",
        ExpressionAttributeValues: {
            ":id":order.user_id,
            ":ts":order.order_time
        }
    };

    docClient.query(query_input).promise()
        .then(data => prepareOrder(data.Items[0], task_token));
    let params = {
        taskToken: task_token,
        result: 'PREPARED'
    };

    swf.respondActivityTaskCompleted(params).promise()
        .then(data => console.log("Successfully completed the task: " + JSON.stringify(data)));
}

swf.pollForActivityTask(input).promise().then(data => {
    handle(JSON.parse(data.input), data.taskToken);
});