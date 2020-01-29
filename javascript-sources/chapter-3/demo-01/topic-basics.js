const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'admin'});

let sns = new AWS.SNS();

//function subscribe(TopicArn) {
    // let params = {
    //     TopicArn: TopicArn,
    //     Protocol: 'SMS',
    //     Endpoint: '+12066666666'
    // };
    //
    // sns.subscribe(params).promise()
    //     .then(data => console.log(data));
//}

// sns.createTopic({
//     Name: "API-TOPIC"
// }) .promise()
//     .then(data => subscribe(data.TopicArn));

publishParams = {
    TopicArn: 'arn:aws:sns:us-west-2:495525968791:API-TOPIC',
    MessageStructure: 'json',
    Message: JSON.stringify({
        default: 'Do not worry, order is being prepped',
        email: 'Order is confirmed'
    }),
    MessageAttributes: {
        "user_id" : {
            DataType: "String",
            StringValue: '1234567890'
        },
        "food_ids": {
            DataType: "String.Array",
            StringValue: '["100","200"]'
        }
    }
};

sns.publish(publishParams).promise()
    .then(data => console.log(data));

