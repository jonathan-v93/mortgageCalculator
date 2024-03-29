import { PaymentScheduleEnum } from "../../../enums/PaymentSchedule.enum";
import { MortgageQueryParms } from "../../../models/MortgageQueryParms";
import { injectable } from "tsyringe";

@injectable()
export class MortgageCalculator {
  mortgageParams: MortgageQueryParms;
  numberOfPaymentsPerAnum: number;

  convertPaymentSchedule(paymentSchedule: number): number {
    switch (paymentSchedule) {
      case PaymentScheduleEnum.AcceleratedBiWeekly:
        return 26;
      case PaymentScheduleEnum.BiWeekly:
        return 24;
      case PaymentScheduleEnum.Monthly:
        return 12;
      default:
        return 12;
    }
  }

  public calculatePerPaymentSchedule(props: MortgageQueryParms): number {
    this.mortgageParams = props;
    this.numberOfPaymentsPerAnum = this.convertPaymentSchedule(
      props.paymentSchedule
    );
    const loanAmount =
      this.mortgageParams.propertyPrice - this.mortgageParams.downPayment;

    // AnnualInterest will be a decimal representing a percentage for the year, we need the amount per payment schedule eg. Monthly = 0.005 => /12 => 0.000416
    const interestPerPayment =
      this.mortgageParams.annualInterest / this.numberOfPaymentsPerAnum;

    // Length of mortgage is in years, we need per payment schedule for this formula
    const numberOfpayments =
      this.mortgageParams.lengthOfMortgage * this.numberOfPaymentsPerAnum;

    const numerator =
      interestPerPayment * Math.pow(1 + interestPerPayment, numberOfpayments);
    const denominator = Math.pow(1 + interestPerPayment, numberOfpayments) - 1;
    const result = loanAmount * (numerator / denominator);
    return +result.toFixed(2);
  }
}
