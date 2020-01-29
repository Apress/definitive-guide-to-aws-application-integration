const AWS = require('aws-sdk');

exports.handler = (event) => {
    let ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    let ts = new Date().toISOString()
        .replace('T', ' ')
        .replace('Z', '');

    let params = {
        TableName: 'orders',
        Item: {
            'user_id' : {S: event.user_id},
            'order_time' : {S: ts},
            'total_amount' : {N: event.total_amount}
        }
    };
    console.log("inserting data");

    ddb.putItem(params, function(err, data) {
        if (err) {
            throw err;
        }
    });

    return {
        statusCode: 200,
        body: "Successfully Inserted Record",
    };
};