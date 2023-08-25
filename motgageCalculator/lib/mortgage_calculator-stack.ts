import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGateway } from "./constructs/ApiGateway";
import { MortgageLambda } from "./constructs/MortgageLambda";
import * as path from "path";

export class MortgageCalculatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGateway = new ApiGateway(this, "MortgageAPI", {
      apiName: "MortgageApi",
      apiDescription: "Handles API requests for mortgage infomation",
    });

    new MortgageLambda(this, "mortgageLambda", {
      name: "mortgageLambda",
      description: "Calculates morgage repayments",
      entry: path.join(__dirname, "./lambdas/MortgageLambdaHandler.ts"),
      handler: "MortgageLambdaHandler",
      httpApi: apiGateway.httpApi,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MotgageCalculatorQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
