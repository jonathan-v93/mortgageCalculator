export enum ErrorCodeEnum {
  PaymentScheduleError = "Payment schedule must be either 1: accelerated bi-weeky, 2: bi-weekly or 3: monthly",
  MoreThanZero = "All values must be passed and greater than 0.",
  MortgageLength = "Length of mortgage must be a multiple of 5 and between 5 and 30 years.",
  DownPaymentInsufficient = "Down payment not sufficient, it must be more than or equal to ",
  InterestInvalid = "Annual Interest rate should be a decimal between 0 and 1.",
  ParamValidationError = "Params error in validation construct",
}
