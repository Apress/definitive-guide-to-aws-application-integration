const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'admin'});

let sfn = new AWS.StepFunctions();

// let createPromise = sfn.createStateMachine({
// 	name: "API-StateMachine",
// 	definition: JSON.stringify({
// 			"StartAt": "HelloWorld",
// 			"States": {
// 				"HelloWorld": {
// 					"Type": "Pass",
// 						"Result": "Hello World!",
// 						"End": true
// 				}
// 			}
// 	}),
// 	roleArn: "arn:aws:iam::495525968791:role/service-role/sfn-sns"
// }).promise();
//
// createPromise.then(data => console.log(data));

let region = 'us-west-2';
let aws_account = 495525968791;

// let item = {
// 	user_id: "12345678" ,
// 	order_time: "2019-08-10 12:35:23.91",
// 	total_amount: "10.1",
// 	food_id: "100",
// 	order_status: "Confirmed"
// };
//
// sfn.startExecution({
// 	name: '12345678-20190810123523.91',
// 	stateMachineArn: `arn:aws:states:${region}:${aws_account}:stateMachine:API-StateMachine`,
// 	input: JSON.stringify(item)
// }).promise().then(data => console.log(data));

sfn.deleteStateMachine({
	stateMachineArn: `arn:aws:states:${region}:${aws_account}:stateMachine:API-StateMachine`
}).promise().then(data => console.log(data));