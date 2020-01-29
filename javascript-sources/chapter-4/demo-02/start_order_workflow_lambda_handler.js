// This is the source code of the lambda function to start order workflow.
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
    let swf = new AWS.SWF();

    let workflowParams = {
      domain: "RestaurantDomain",
      workflowId: event.user_id + "_" + ts,
      workflowType: {
        name: "OrderWorkflow",
        version: "0.1"
      },
      input: JSON.stringify({
        user_id : event.user_id,
        order_time: ts
      })
    };

    await swf.startWorkflowExecution(workflowParams).promise()
        .then(data => console.log(data))
        .catch(err => console.log(err));

    console.log("Successfully inserted data and started workflow");
    context.succeed(ts);
  } catch (err) {
    context.fail(err);
  }
};