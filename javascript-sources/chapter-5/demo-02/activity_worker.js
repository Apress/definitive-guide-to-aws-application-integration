const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'admin'});

let sfn = new AWS.StepFunctions();

function processData(data) {
	let order = JSON.parse(data.input);
	let success = false;
	// some complex work that may take lot of time to finish
	sfn.sendTaskHeartbeat({
		taskToken: data.taskToken
	});
	// this process should ideally set the success variable to true
	if(success === true) {
		order.status = "PREPPED";
		sfn.sendTaskSuccess({
			taskToken: data.taskToken,
			output: JSON.stringify(order)
		}).promise()
			.then(successResult => console.log(successResult))
			.catch(error => console.log(error));
	} else {
		console.log("Error preparing the order");
		sfn.sendTaskFailure({
			taskToken: data.taskToken,
			error: "ERROR107",
			cause: "Error Preparing the order due to missing ingredients"
		}).promise().then(data => console.log(data));
	}
}

sfn.getActivityTask({
	activityArn: "arn:aws:states:us-west-2:495525968791:activity:prep_order_activity"
}).promise().then(data => {
	processData(data);
});