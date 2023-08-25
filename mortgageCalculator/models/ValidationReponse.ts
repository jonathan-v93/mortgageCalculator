import { MortgageQueryParms } from "./MortgageQueryParms";

export interface ValidationResponse {
  success: boolean;
  error?: string;
  data?: MortgageQueryParms;
}
