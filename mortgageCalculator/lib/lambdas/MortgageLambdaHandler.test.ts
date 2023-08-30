import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { MortgageLambdaHandler } from "./MortgageLambdaHandler";
import { mock } from "jest-mock-extended";
import { StatusCodeEnum } from "../../enums/StatusCode.enum";
import { ErrorMessageEnum } from "../../enums/ErrorMessage.enum";

describe("Test MotrgageLambdaHandler is working", () => {
  it("Should return successfull correct response, given valid inputs", async () => {
    const mockEvent: APIGatewayProxyEventV2 = {
      version: "",
      routeKey: "",
      rawPath: "",
      rawQueryString: "",
      headers: {
        header1: "value1",
        header2: "value1,value2",
      },
      queryStringParameters: {
        propertyPrice: "100000",
        downPayment: "10000",
        annualInterest: "0.05",
        lengthOfMortgage: "30",
        paymentSchedule: "1",
      },
      requestContext: {
        accountId: "",
        apiId: "",
        domainName: "",
        domainPrefix: "",
        http: {
          method: "GET",
          path: "/mortgageCalculator",
          protocol: "",
          sourceIp: "",
          userAgent: "",
        },
        requestId: "",
        routeKey: "",
        stage: "",
        time: "",
        timeEpoch: 0,
      },
      isBase64Encoded: false,
    };

    const expectedResponse = {
      statusCode: StatusCodeEnum.Success,
      headers: { "Content-Type": "application/json" },
      body: "222.87982065285644",
    };

    const context = mock<Context>();
    const callback = jest.fn();

    const result = await MortgageLambdaHandler(mockEvent, context, callback);
    expect(result).toEqual(expectedResponse);
  });

  it("Should return Bad Request response, given invalid inputs", async () => {
    const mockEvent: APIGatewayProxyEventV2 = {
      version: "",
      routeKey: "",
      rawPath: "",
      rawQueryString: "",
      headers: {
        header1: "value1",
        header2: "value1,value2",
      },
      queryStringParameters: {
        propertyPrice: "100000",
        downPayment: "100",
        annualInterest: "0.05",
        lengthOfMortgage: "30",
        paymentSchedule: "1",
      },
      requestContext: {
        accountId: "",
        apiId: "",
        domainName: "",
        domainPrefix: "",
        http: {
          method: "GET",
          path: "/mortgageCalculator",
          protocol: "",
          sourceIp: "",
          userAgent: "",
        },
        requestId: "",
        routeKey: "",
        stage: "",
        time: "",
        timeEpoch: 0,
      },
      isBase64Encoded: false,
    };

    const expectedResponse = {
      statusCode: StatusCodeEnum.BadRequest,
      headers: { "Content-Type": "application/json" },
      body: ErrorMessageEnum.DownPaymentInsufficient + "10%",
    };

    const context = mock<Context>();
    const callback = jest.fn();

    const result = await MortgageLambdaHandler(mockEvent, context, callback);
    expect(result).toEqual(expectedResponse);
  });
});
