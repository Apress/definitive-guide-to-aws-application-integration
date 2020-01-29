const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'admin'});

let sfn = new AWS.StepFunctions();

sfn.createActivity({
	name: "prep_order_activity"
}).promise().then(
	data => console.log(data)
);