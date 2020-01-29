// This is the source code of the lambda function to save orders.
const AWS = require("aws-sdk");

function handleError(error) {
  throw error;
}

exports.handler = async (event, context) => {
  let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  let ts = new Date()
    .toISOString()
    .replace("T", " ")
    .replace("Z", "");
  let item = {
    user_id: { S: event.user_id },
    order_time: { S: ts },
    total_amount: { N: "" + event.total_amount },
    food_id: { S: "" + event.food_id },
    order_status: { S: "Confirmed" }
  };
  let params = {
    TableName: "orders",
    Item: item
  };
  console.log("inserting data");

  try {
    await ddb.putItem(params).promise();
    let sqs = new AWS.SQS();
    let request = {
      "QueueUrl": process.env.ORDERS_QUEUE_URL,
      "MessageBody": JSON.stringify({
        user_id: event.user_id,
        order_time: ts
      }),
    };
    await sqs.sendMessage(request).promise()
        .then(data => console.log("Order has been inserted in queue: %j", item))
        .catch(error=> handleError(error));
    console.log("Successfully inserted data");
    context.succeed(ts);
  } catch (err) {
    context.fail(err);
  }
};