let AWS = require('aws-sdk');
let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
    for(let record of event.Records) {
        let sns = record.Sns;
        let order = JSON.parse(sns.Message);
        let item = {
            user_id: { S: order.user_id },
            order_time: { S: order.order_time },
            total_amount: { N: "" + order.total_amount },
            food_id: { S: "" + order.food_id },
            order_status: { S: "Confirmed" }
        };
        let params = {
            TableName: "orders",
            Item: item
        };
        await ddb.putItem(params).promise();
    }
    const response = {
        statusCode: 200
    };
    return response;
};