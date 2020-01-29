const { Consumer } = require('sqs-consumer');
const AWS = require("aws-sdk");
AWS.config.region = "us-west-2";

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-west-2:eac50233-9edd-4082-a12c-16120e9b6902"
});

let docClient = new AWS.DynamoDB.DocumentClient();

const app = Consumer.create({
    queueUrl: 'https://sqs.us-west-2.amazonaws.com/495525968791/orders_prep_queue',
    handleMessage: (message) => {
        let order = JSON.parse(message.Body);
        console.log('Processing the message %j', message.Body);
        setOrderStatus(order, "PREPARED");
    },
    waitTimeSeconds: 20
});

app.on('error', (err) => console.error(err.message));

app.on('processing_error', (err) => console.error(err.message));

setOrderStatus = (order, status) => {
    let request = {
        TableName: "orders",
        Key: {
            'user_id' : order.user_id,
            'order_time' : order.order_time
        },
        UpdateExpression: 'set order_status = :s',
        ExpressionAttributeValues: {
            ':s' : status
        },
        ReturnValues: "UPDATED_NEW"
    };
    let updatePromise = docClient.update(request).promise();
    updatePromise.then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(console.log("finished"));
};

app.start();