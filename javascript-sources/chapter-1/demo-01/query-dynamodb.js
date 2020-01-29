// Load the SDK for JavaScript
let AWS = require('aws-sdk');

let common = require('./common');
common.configure_credentials(AWS);

let docClient = new AWS.DynamoDB.DocumentClient();

let query_input = {
    TableName : "orders",
    KeyConditionExpression: "#id = :id and begins_with(#ts, :ts)",
    ExpressionAttributeNames: {
        "#id": "user_id",
        "#ts":"order_time"
    },
    ExpressionAttributeValues: {
        ":id":"001",
        ":ts":"2019-0"
    }
};

// Call DynamoDB to add the item to the table
docClient.query(query_input, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log(data.Items);
    }
});