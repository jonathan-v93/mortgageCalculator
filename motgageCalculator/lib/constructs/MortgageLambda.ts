import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Duration } from "aws-cdk-lib";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export interface MortgageLambdaProps {
  name: string;
  description: string;
  entry: string;
  handler: string;
  httpApi: apigwv2.HttpApi;
}

export class MortgageLambda extends Construct {
  public lambda: NodejsFunction;
  constructor(scope: Construct, id: string, props: MortgageLambdaProps) {
    super(scope, id);
    this.lambda = new NodejsFunction(this, "MorgageLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: props.handler,
      functionName: props.name,
      description: props.description,
      entry: props.entry,
      logRetention: RetentionDays.TWO_WEEKS,
      timeout: Duration.minutes(1),
      memorySize: 512,
    });
    const httpLambdaIntegration = new HttpLambdaIntegration(
      "httpLambdaIntegration",
      this.lambda
    );

    props.httpApi.addRoutes({
      path: "/test",
      methods: [apigwv2.HttpMethod.ANY],
      integration: httpLambdaIntegration,
    });
  }
}
