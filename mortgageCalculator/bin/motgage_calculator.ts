#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MortgageCalculatorStack } from "../lib/mortgage_calculator-stack";
import * as dotenv from "dotenv";

if (typeof process.env.NODE_ENV === "undefined") {
  throw new Error("NODE_ENV variable not set");
}

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (typeof process.env.AWS_REGION === "undefined") {
  throw new Error("AWS_REGION variable not set");
}

if (typeof process.env.AWS_ACCOUNT_ID === "undefined") {
  throw new Error("AWS_ACCOUNT variable not set");
}

const app = new cdk.App();
new MortgageCalculatorStack(app, "MotgageCalculatorStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
