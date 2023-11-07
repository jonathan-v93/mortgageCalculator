import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { ValidationResponse } from "../../models/ValidationReponse";
import { EventParameterValidator } from "./constructs/EventParameterValidator";
import { MortgageCalculator } from "./constructs/MortgageCalculator";
import { ErrorMessageEnum } from "../../enums/ErrorMessage.enum";
import { StatusCodeEnum } from "../../enums/StatusCode.enum";
import { container } from "tsyringe";

export const MortgageLambdaHandler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async function (event: APIGatewayProxyEventV2) {
  const validator = container.resolve(EventParameterValidator);
  const mortgageCalculator = container.resolve(MortgageCalculator);

  const validationResponse: ValidationResponse = validator.validate(event);

  if (validationResponse.success === false || !validationResponse.data) {
    return {
      statusCode: StatusCodeEnum.BadRequest,
      headers: { "Content-Type": "application/json" },
      body: validationResponse.error ?? ErrorMessageEnum.ParamValidationError,
    };
  }
  const perPaymentScheduleAmount =
    mortgageCalculator.calculatePerPaymentSchedule(validationResponse.data);

  return {
    statusCode: StatusCodeEnum.Success,
    headers: { "Content-Type": "application/json" },
    body: `${perPaymentScheduleAmount}`,
  };
};
