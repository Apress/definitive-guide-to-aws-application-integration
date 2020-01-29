// This is the source code of the lambda function to cancel existing orders.
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

    let params = {
        TableName: "orders",
        Key: {
            user_id: { S: event.user_id },
            order_time: { S: event.order_time }
        },
        UpdateExpression: "set order_status = :val1",
        "ExpressionAttributeValues": {
            ":val1": {"S": "CANCELLED"}
        },
    };
    console.log("cancelling order");
    try {
        await ddb.updateItem(params).promise();
        console.log("Successfully cancelled data");
        context.succeed(event.order_time);
    } catch (err) {
        context.fail(err);
    }
};

// Uncomment the below code to debug the lambda function locally
// Replace IdentityPoolId value with your pool id. It won't return response, however as we are passing a dummy context that just prints
// AWS.config.region = "us-west-2";
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "us-west-2:eac50233-9edd-4082-a12c-16120e9b6902"
// });
//
// let event = {
//   user_id: "1234567890",
//   order_time: "2019-04-28 17:51:46.640"
// };
//
// let dummyContext = {
//   fail: function (err) {
//     throw err
//   },
//   succeed: function (message) {
//     console.log(message)
//   }
// };
//
// exports.handler(event, dummyContext);
