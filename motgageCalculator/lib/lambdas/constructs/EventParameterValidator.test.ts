import {
  APIGatewayEventRequestContextV2,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventV2,
} from "aws-lambda";
import { EventParameterValidator } from "./EventParameterValidator";
import { ValidationResponse } from "../../../models/ValidationReponse";
import { ErrorCodeEnum } from "../../../enums/ErrorMessageEnum";

const headers: APIGatewayProxyEventHeaders = {};
const requestContext: APIGatewayEventRequestContextV2 = {
  accountId: "",
  apiId: "",
  domainName: "",
  domainPrefix: "",
  http: {
    method: "",
    path: "",
    protocol: "",
    sourceIp: "",
    userAgent: "",
  },
  requestId: "",
  routeKey: "",
  stage: "",
  time: "",
  timeEpoch: 0,
};

describe("EventParameterValidation tests", () => {
  it("Given no query string, class creates params and defaults them all to zero", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath: "",
      rawQueryString: "",
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    expect(validator.propertyPrice).toBe(0);
    expect(validator.downPayment).toBe(0);
    expect(validator.annualInterest).toBe(0);
    expect(validator.lengthOfMortgage).toBe(0);
    expect(validator.paymentSchedule).toBe(0);
  });

  it("Given values, class creates params and assignes correctly", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    expect(validator.propertyPrice).toBe(100);
    expect(validator.downPayment).toBe(10);
    expect(validator.annualInterest).toBe(0.05);
    expect(validator.lengthOfMortgage).toBe(30);
    expect(validator.paymentSchedule).toBe(1);
  });

  it("Can get down payment percent string", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath: "/test",
      rawQueryString: "",
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    expect(validator.downpaymentPercentage).toBe("10%");
  });

  it("Given values, class creates params and assignes correctly", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    expect(validator.propertyPrice).toBe(100);
    expect(validator.downPayment).toBe(10);
    expect(validator.annualInterest).toBe(0.05);
    expect(validator.lengthOfMortgage).toBe(30);
    expect(validator.paymentSchedule).toBe(1);
  });

  it("Validates payment schedule - success", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.paymentSchedule).toBe(1);
    expect(response.success).toEqual(true);
  });

  it("Validates payment schedule - fail", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=4",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=4",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "4",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.paymentSchedule).toBe(4);
    expect(response.success).toBe(false);
    expect(response.error).toBe(ErrorCodeEnum.PaymentScheduleError);
  });

  it("Validates that all values are more than 0 - fail", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=0&downPayment=0&annualInterest=0&lengthOfMortgage=0&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=0&downPayment=0&annualInterest=0&lengthOfMortgage=0&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "0",
        propertyPrice: "0",
        downPayment: "0",
        annualInterest: "0",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.lengthOfMortgage).toBe(0);
    expect(validator.propertyPrice).toBe(0);
    expect(validator.downPayment).toBe(0);
    expect(validator.annualInterest).toBe(0);
    expect(response.success).toBe(false);
    expect(response.error).toBe(ErrorCodeEnum.MoreThanZero);
  });

  it("Validates that the down payment meets the miminum percentage of the property price - fail", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=9&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=9&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "9",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.propertyPrice).toBe(100);
    expect(response.success).toBe(false);
    expect(response.error).toBe(
      ErrorCodeEnum.DownPaymentInsufficient + validator.downpaymentPercentage
    );
  });

  it("Validates mortgage length is between 50 and 30 years - fail", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=35&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=35&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "35",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.lengthOfMortgage).toBe(35);
    expect(response.success).toBe(false);
    expect(response.error).toBe(ErrorCodeEnum.MortgageLength);
  });

  it("Validates mortgage length is a multiple of 5 between 5 and 30 - fail", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=13&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=13&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "13",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.lengthOfMortgage).toBe(13);
    expect(response.success).toBe(false);
    expect(response.error).toBe(ErrorCodeEnum.MortgageLength);
  });

  it("Validates interest rate is between 0 and 1 - fail", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=2.78&lengthOfMortgage=30&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=2.78&lengthOfMortgage=30&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "2.78",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    expect(validator.annualInterest).toBe(2.78);
    expect(response.success).toBe(false);
    expect(response.error).toBe(ErrorCodeEnum.InterestInvalid);
  });

  it("Responds with correct data object", () => {
    const event: APIGatewayProxyEventV2 = {
      version: "1.0",
      routeKey: "test",
      rawPath:
        "/test?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      rawQueryString:
        "?propertyPrice=100&downPayment=10&annualInterest=0.05&lengthOfMortgage=30&paymentSchedule=1",
      queryStringParameters: {
        lengthOfMortgage: "30",
        propertyPrice: "100",
        downPayment: "10",
        annualInterest: "0.05",
        paymentSchedule: "1",
      },
      isBase64Encoded: false,
      headers,
      requestContext,
    };
    const validator = new EventParameterValidator(event);
    const response: ValidationResponse = validator.validate();
    const expectedResponse = {
      success: true,
      data: {
        propertyPrice: 100,
        downPayment: 10,
        annualInterest: 0.05,
        lengthOfMortgage: 30,
        paymentSchedule: 1,
      },
    };

    expect(response).toEqual(expect.objectContaining(expectedResponse));
  });
});
