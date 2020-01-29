const AWS = require("aws-sdk");
import {
  AWS_REGION,
  CANCEL_ORDER_LAMBDA,
  COGNITO_IDENTITY_POOL_ID,
  SAVE_ORDER_LAMBDA
} from "../constants";
import store from "../store";

export class LambdaCaller {
  constructor() {
    AWS.config.region = AWS_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: COGNITO_IDENTITY_POOL_ID
    });
  }

  async cancel_order(food_id) {
    let payload = {
      user_id: store.state.user,
      order_time: store.state.ordered_items.get(food_id)
    };

    let params = this.getParams(CANCEL_ORDER_LAMBDA, payload);

    try {
      await this.getLambdaClient()
        .invoke(params)
        .promise();
    } catch (err) {
      throw err;
    }
  }

  getLambdaClient() {
    return new AWS.Lambda({
      region: AWS_REGION,
      apiVersion: "2015-03-31"
    });
  }

  getParams(lambda, payload) {
    return {
      FunctionName: lambda,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(payload)
    };
  }
}
