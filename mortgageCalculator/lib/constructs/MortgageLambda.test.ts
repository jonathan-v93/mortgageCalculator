import * as cdk from "aws-cdk-lib";
import { MortgageLambda } from "./MortgageLambda";
import * as path from "path";
import { Template } from "aws-cdk-lib/assertions";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";

describe("Test if the CDK Mortgage Lambda works", () => {
  it("test lamda function is created with correct properties", () => {
    const stack = new cdk.Stack();
    new MortgageLambda(stack, "testMortgageLambda", {
      name: "testMortgaugeLambda",
      description: "description for test morgageLambda",
      entry: path.join(__dirname, "../lambdas/MortgageLambdaHandler.ts"),
      handler: "testHandler",
      httpApi: new apigwv2.HttpApi(stack, "testAPI", { apiName: "testAPI" }),
    });
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs18.x",
      Handler: "index.testHandler",
      FunctionName: "testMortgaugeLambda",
      Description: "description for test morgageLambda",
      MemorySize: 512,
      Timeout: 60,
    });
  });
});
