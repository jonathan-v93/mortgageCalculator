import { Template } from "aws-cdk-lib/assertions";
import { MortgageCalculatorStack } from "./mortgage_calculator-stack";
import * as cdk from "aws-cdk-lib";

describe("Test Mortgage calculator stack is working", () => {
  const env = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });
  afterEach(() => {
    process.env = env;
  });

  it("should create 1 lambda", () => {
    process.env.NODE_ENV = "sandbox";
    const app = new cdk.App();
    const mortgageCalculatorStack = new MortgageCalculatorStack(
      app,
      "testStack"
    );
    const template = Template.fromStack(mortgageCalculatorStack);
    template.resourceCountIs("AWS::Lambda::Function", 2);
  });

  it("should create Api Gateway Http", () => {
    process.env.NODE_ENV = "sandbox";
    const app = new cdk.App();
    const mortgageCalculatorStack = new MortgageCalculatorStack(
      app,
      "testStack"
    );
    const template = Template.fromStack(mortgageCalculatorStack);
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
  });
});
