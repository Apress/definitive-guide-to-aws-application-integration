Before you can run the application awsome-restaurant, you need to do some tasks. 
1. Create lambda functions in your aws account with names save-order and cancel-order in region us-west-2
1. If you want to create them in any other region or with different names, make changes to constants.js file in awsome-restaurant folder
1. Change the Cognito Identity Pool Id value in constants.js
1. You should have a dynamodb table with name orders with user_id as hashkey and order_time as sort key, previous demos should have already instructed to create this table
These are Lambda functions required for awesome-restaurant-start
1. Run npm install in awsome-restaurant
 
##### Start the application with the command `npm run serve`