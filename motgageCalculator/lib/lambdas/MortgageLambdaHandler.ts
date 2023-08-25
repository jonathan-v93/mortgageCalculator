import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { ValidationResponse } from "../../models/ValidationReponse";
import { EventParameterValidator } from "./constructs/EventParameterValidator";
import { MortgageCalculator } from "./constructs/MortgageCalculator";
import { ErrorCodeEnum } from "../../enums/ErrorMessageEnum";
import { StatusCodeEnum } from "../../enums/StatusCodeEnum";

export const MortgageLambdaHandler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async function (event: APIGatewayProxyEventV2, context) {
  const validator = new EventParameterValidator(event);

  const validationResponse: ValidationResponse = validator.validate();
  if (
    validationResponse.success === false ||
    validationResponse.data === undefined
  ) {
    return {
      statusCode: StatusCodeEnum.BadRequest,
      headers: { "Content-Type": "application/json" },
      body: validationResponse.error ?? ErrorCodeEnum.ParamValidationError,
    };
  }

  const mortgageCalculator = new MortgageCalculator(validationResponse.data);
  const perPaymentScheduleAmount =
    mortgageCalculator.calculatePerPaymentSchedue();

  return {
    statusCode: StatusCodeEnum.BadRequest,
    headers: { "Content-Type": "application/json" },
    body: `${perPaymentScheduleAmount}`,
  };
};
