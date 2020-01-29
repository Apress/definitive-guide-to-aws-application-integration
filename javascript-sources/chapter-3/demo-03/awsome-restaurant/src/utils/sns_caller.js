const AWS = require("aws-sdk");
import {
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
  ORDER_TOPIC,
  PLATFORM_APPLICATION_ARN
} from "../constants";
import store from "../store";

export class SnsCaller {
  constructor() {
    AWS.config.region = AWS_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: COGNITO_IDENTITY_POOL_ID
    });
  }

  async save_order(food_id, amount) {
    let payload = {
      user_id: store.state.user,
      food_id: food_id,
      order_time: new Date()
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
      total_amount: amount
    };

    let params = SnsCaller.getParamsWithFilter(ORDER_TOPIC, payload);
    await SnsCaller.getSnsClient()
      .publish(params)
      .promise();
    return payload;
  }

  async enablePushNotifications() {
    SnsCaller.getSnsClient()
      .createPlatformEndpoint({
        PlatformApplicationArn: PLATFORM_APPLICATION_ARN,
        Token: window.token
      })
      .promise()
      .then(data => console.log(data));
  }

  async subscribe(phone_number, email) {
    let filterPolicy = {
      user_id: [store.state.user],
      total_amount: [{ numeric: [">=", 5] }]
    };

    if (phone_number) {
      await SnsCaller.getSnsClient()
        .subscribe({
          TopicArn: ORDER_TOPIC,
          Protocol: "sms",
          Endpoint: phone_number,
          Attributes: {
            FilterPolicy: JSON.stringify(filterPolicy)
          }
        })
        .promise()
        .then(data => console.log(data));
    }

    if (email) {
      await SnsCaller.getSnsClient()
        .subscribe({
          TopicArn: ORDER_TOPIC,
          Protocol: "email",
          Endpoint: email,
          Attributes: {
            FilterPolicy: JSON.stringify(filterPolicy)
          }
        })
        .promise()
        .then(data => console.log(data));
    }
  }

  static getSnsClient() {
    return new AWS.SNS({
      region: AWS_REGION,
      apiVersion: "2015-03-31"
    });
  }

  static getParams(topic, payload) {
    return {
      TopicArn: topic,
      MessageStructure: "json",
      Message: JSON.stringify({
        lambda: JSON.stringify(payload),
        sqs: JSON.stringify(payload),
        default: "Order is confirmed"
      })
    };
  }

  static getParamsWithFilter(topic, payload) {
    return {
      TopicArn: topic,
      MessageStructure: "json",
      Message: JSON.stringify({
        lambda: JSON.stringify(payload),
        sqs: JSON.stringify(payload),
        default: "Order is confirmed"
      }),
      MessageAttributes: {
        user_id: {
          DataType: "String",
          StringValue: store.state.user
        },
        total_amount: {
          DataType: "Number",
          StringValue: "" + payload.total_amount
        }
      }
    };
  }
}
