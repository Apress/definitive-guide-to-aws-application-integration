// This is the source code of the lambda function to save orders.
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  let ts = new Date()
    .toISOString()
    .replace("T", " ")
    .replace("Z", "");

  let params = {
    TableName: "orders",
    Item: {
      user_id: { S: event.user_id },
      order_time: { S: ts },
      total_amount: { N: "" + event.total_amount },
      food_id: { S: "" + event.food_id },
      order_status: { S: "CONFIRMED" }
    }
  };
  console.log("inserting data");

  try {
    await ddb.putItem(params).promise();
    console.log("Successfully inserted data");
    context.succeed(ts);
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
//   total_amount: 10.11,
//   food_id: 100
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
