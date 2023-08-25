import { Construct } from "constructs";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";

export interface ApiGatewayProps {
  apiName: string;
  apiDescription: string;
}

export class ApiGateway extends Construct {
  public httpApi: apigwv2.HttpApi;
  public domainName: string;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);
    this.httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      apiName: props.apiName,
      description: props.apiDescription,
    });
  }
}
