const AWS = require("aws-sdk");
let docClient = {};
console.log('Loading function');

exports.handler = async (event) => {
    docClient = new AWS.DynamoDB.DocumentClient();
    for (const { body, } of event.Records) {
        let order = JSON.parse(body);
        let query_input = {
            TableName : "orders",
            KeyConditionExpression: "user_id = :id and order_time = :ts",
            ExpressionAttributeValues: {
                ":id":order.user_id,
                ":ts":order.order_time
            }
        };
        let query = docClient.query(query_input).promise();
        await query.then(orders => processOrders(orders.Items))
            .catch(error => handleError(error));
    }
    return `Successfully processed ${event.Records.length} messages.`;
};

processOrders = async (orders) => {
    if (orders && orders[0]) {
        let order = orders[0];
        switch(order.order_status.toUpperCase()) {
            case 'CONFIRMED':
                await setOrderStatus(order, 'PREP_QUEUE');
                await pushToQueue(order, process.env.PREP_QUEUE_URL);
                throw new Error('Order In Progress');
            case 'PREPARED':
                await setOrderStatus(order, 'COOK_QUEUE');
                await pushToQueue(order, process.env.COOK_QUEUE_URL);
                throw new Error('Order In Progress');
            case 'COOKED':
                await setOrderStatus(order, 'PACK_QUEUE');
                await pushToQueue(order, process.env.PACK_QUEUE_URL);
                throw new Error('Order In Progress');
            case 'PACKED':
                await setOrderStatus(order, 'DELIVER_QUEUE');
                await pushToQueue(order, process.env.DELIVER_QUEUE_URL);
                throw new Error('Order In Progress');
            case 'DELIVERED':
                await setOrderStatus(order, 'COMPLETED');
                break;
            case 'PREP_QUEUE':
            case 'COOK_QUEUE':
            case 'PACK_QUEUE':
            case 'DELIVER_QUEUE':
                throw new Error('Order In Progress');
            case 'COMPLETED':
                console.log('Removing order as the order is already completed: %j', order);
                break;
            default:
                await setOrderStatus(order, 'CANCELLED');
                console.log('Removing order from orders queue as status is invalid for order: %j', order)
        }
    } else {
        console.log('No orders for the given message, it will be removed from the queue')
    }
};

pushToQueue = async (order, queue_url) => {
    let sqs = new AWS.SQS();
    let request = {
        "QueueUrl": queue_url,
        "MessageBody": JSON.stringify(order),
    };
    await sqs.sendMessage(request).promise()
        .then(data => console.log("Order has been moved to queue[%s]: %j", queue_url, order))
        .catch(error=> handleError(error))
};

setOrderStatus = async (order, status) => {
    order.order_status = status;
    let request = {
        TableName: "orders",
        Item: order
    };
    let promise = docClient.put(request).promise();
    await promise.then(data => console.log('Order status has been updated: %j', order))
        .catch(err=> handleError(err))
};

function handleError(err) {
    throw err;
}


// Uncomment the below code to debug the lambda function locally
// Replace IdentityPoolId value with your pool id. It won't return response, however as we are passing a dummy context that just prints
// AWS.config.region = "us-west-2";
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "us-west-2:eac50233-9edd-4082-a12c-16120e9b6902"
// });
//
// let event = {
//     "Records": [
//         {
//             "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
//             "receiptHandle": "MessageReceiptHandle",
//             "body": "{\"user_id\": \"ce191ec0-6ecb-11e9-83a6-cd81c061ae37\", \"order_time\": \"2019-05-05 00:22:01.078\"}",
//             "attributes": {
//                 "ApproximateReceiveCount": "1",
//                 "SentTimestamp": "1523232000000",
//                 "SenderId": "123456789012",
//                 "ApproximateFirstReceiveTimestamp": "1523232000001"
//             },
//             "messageAttributes": {},
//             "md5OfBody": "7b270e59b47ff90a553787216d55d91d",
//             "eventSource": "aws:sqs",
//             "eventSourceARN": "arn:aws:sqs:us-west-2:123456789012:MyQueue",
//             "awsRegion": "us-west-2"
//         }
//     ]
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
// exports.handler(event, dummyContext).then(message => console.log(message)).catch(err => dummyContext.fail(err));
