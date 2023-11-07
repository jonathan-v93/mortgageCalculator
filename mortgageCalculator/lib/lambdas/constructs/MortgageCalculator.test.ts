import "reflect-metadata";
import { MortgageCalculator } from "./MortgageCalculator";
import { MortgageQueryParms } from "../../../models/MortgageQueryParms";
import { container } from "tsyringe";

let testCalculator: MortgageCalculator;
beforeEach(() => {
  testCalculator = container.resolve(MortgageCalculator);
});

describe("Mortgage calculator tests", () => {
  it("assignes mortgageParams during contruction", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 3,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(testCalculator.mortgageParams).toEqual(props);
  });

  it("creates numberOfPaymentVaraible of 26 based on the payment schedule prop of 1", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 1,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(testCalculator.numberOfPaymentsPerAnum).toEqual(26);
  });

  it("creates numberOfPaymentVaraible of 24 based on the payment schedule prop of 2", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 2,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(testCalculator.numberOfPaymentsPerAnum).toEqual(24);
  });

  it("creates numberOfPaymentVaraible of 12 based on the payment schedule prop of 3", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 3,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(testCalculator.numberOfPaymentsPerAnum).toEqual(12);
  });

  it("convertPaymentSchedule is a function that return a number", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 1,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(typeof testCalculator.convertPaymentSchedule).toBe("function");
    expect(
      typeof testCalculator.convertPaymentSchedule(props.paymentSchedule)
    ).toBe("number");
  });

  it("creates numberOfPaymentVaraible of 12 based on the payment schedule prop of NaN", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: NaN,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(testCalculator.numberOfPaymentsPerAnum).toEqual(12);
  });

  it("calcutatePerPaymentSchedule is a function that return a number", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 1,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(typeof testCalculator.calculatePerPaymentSchedule).toBe("function");
    expect(typeof testCalculator.calculatePerPaymentSchedule(props)).toBe(
      "number"
    );
  });

  it("caclulates per payment schedule when we call calcutatePerPaymentSchedule method", () => {
    const props: MortgageQueryParms = {
      propertyPrice: 100000,
      downPayment: 10000,
      annualInterest: 0.05,
      lengthOfMortgage: 30,
      paymentSchedule: 1,
    };
    testCalculator.calculatePerPaymentSchedule(props);
    expect(typeof testCalculator.calculatePerPaymentSchedule).toBe("function");
    expect(typeof testCalculator.calculatePerPaymentSchedule(props)).toBe(
      "number"
    );
    expect(testCalculator.calculatePerPaymentSchedule(props)).toBe(222.88);
  });
});
