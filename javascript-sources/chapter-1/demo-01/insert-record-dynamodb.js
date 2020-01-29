// Load the SDK for JavaScript
let AWS = require('aws-sdk');

let common = require('./common');
common.configure_credentials(AWS);

// Create the DynamoDB service object
let ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let params = {
    TableName: 'orders',
    Item: {
        'user_id' : {S: '001'},
        'order_time' : {S: common.get_time()},
        'total_amount' : {N: '10.45'}
    }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success");
    }
});