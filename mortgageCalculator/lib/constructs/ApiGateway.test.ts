import { ApiGateway } from "./ApiGateway";
import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

describe("Test if the ApiGateway contruct works", () => {
  it("should create ApiGateway hhtp Api", () => {
    const stack = new cdk.Stack();
    new ApiGateway(stack, "testApiGatewayContruct", {
      apiName: "testApiGateway",
      apiDescription: "description for test ApiGateway",
    });
    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      Name: "testApiGateway",
      Description: "description for test ApiGateway",
      ProtocolType: "HTTP",
    });
  });
});
