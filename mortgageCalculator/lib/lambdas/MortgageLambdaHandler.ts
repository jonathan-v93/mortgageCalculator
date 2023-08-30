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
      headers: {
        "Content-Type": "application/json",
      },
      body: validationResponse.error ?? ErrorMessageEnum.ParamValidationError,
    };
  }

  const mortgageCalculator = new MortgageCalculator(validationResponse.data);
  const perPaymentScheduleAmount =
    mortgageCalculator.calculatePerPaymentSchedule();

  return {
    statusCode: StatusCodeEnum.Success,
    headers: { "Content-Type": "application/json" },
    body: `${perPaymentScheduleAmount}`,
  };
};
