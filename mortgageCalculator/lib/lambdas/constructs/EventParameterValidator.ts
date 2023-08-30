import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationResponse } from "../../../models/ValidationReponse";
import { MortgageQueryParms } from "../../../models/MortgageQueryParms";
import { ErrorMessageEnum } from "../../../enums/ErrorMessage.enum";
import { PaymentScheduleEnum } from "../../../enums/PaymentSchedule.enum";

export class EventParameterValidator implements MortgageQueryParms {
  minimumDownPaymentPercent: number = 10; // Move this to process.env.MINIMUM_DOWNPAYMENT_PERCENTAGE
  propertyPrice: number;
  downPayment: number;
  annualInterest: number;
  lengthOfMortgage: number;
  paymentSchedule: number;

  constructor(event: APIGatewayProxyEventV2) {
    const params = event.queryStringParameters;
    this.propertyPrice = this.convertToNumber(params?.propertyPrice);
    this.downPayment = this.convertToNumber(params?.downPayment);
    this.annualInterest = this.convertToNumber(params?.annualInterest);
    this.lengthOfMortgage = this.convertToNumber(params?.lengthOfMortgage);
    this.paymentSchedule = this.convertToNumber(params?.paymentSchedule);
  }
  get downpaymentPercentage() {
    return `${this.minimumDownPaymentPercent}%`;
  }

  convertToNumber(param: string | undefined): number {
    return param !== undefined && param.length > 0 ? +param : 0;
  }

  validatePaymentSchedule(): boolean {
    return (
      this.paymentSchedule === +PaymentScheduleEnum.AcceleratedBiWeekly ||
      this.paymentSchedule === +PaymentScheduleEnum.BiWeekly ||
      this.paymentSchedule === +PaymentScheduleEnum.Monthly
    );
  }

  validateMoreThanZero(): boolean {
    return (
      this.propertyPrice > 0 &&
      this.downPayment > 0 &&
      this.annualInterest > 0 &&
      this.lengthOfMortgage > 0
    );
  }

  validateInterestRate(): boolean {
    return this.annualInterest >= 0 && this.annualInterest <= 1;
  }

  validatedDownPayment(): boolean {
    const percentageOfPropertyPrice =
      (this.propertyPrice / 100) * this.minimumDownPaymentPercent;
    return this.downPayment >= percentageOfPropertyPrice;
  }

  validateLengthOfMortgage(): boolean {
    return (
      this.lengthOfMortgage >= 5 &&
      this.lengthOfMortgage <= 30 &&
      this.lengthOfMortgage % 5 === 0
    );
  }

  validate(): ValidationResponse {
    const response: ValidationResponse = {
      success: false,
    };
    if (!this.validatePaymentSchedule()) {
      response.error = ErrorMessageEnum.PaymentScheduleError;
      return response;
    }
    if (!this.validateMoreThanZero()) {
      response.error = ErrorMessageEnum.MoreThanZero;
      return response;
    }
    if (!this.validatedDownPayment()) {
      response.error = `${ErrorMessageEnum.DownPaymentInsufficient}${this.downpaymentPercentage}`;
      return response;
    }
    if (!this.validateLengthOfMortgage()) {
      response.error = ErrorMessageEnum.MortgageLength;
      return response;
    }
    if (!this.validateInterestRate()) {
      response.error = ErrorMessageEnum.InterestInvalid;
      return response;
    }
    response.success = true;
    response.data = {
      propertyPrice: this.propertyPrice,
      downPayment: this.downPayment,
      annualInterest: this.annualInterest,
      lengthOfMortgage: this.lengthOfMortgage,
      paymentSchedule: this.paymentSchedule,
    };
    return response;
  }
}
