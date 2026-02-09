export const TEAL_GRADIENT = "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)";
export const MAX_ATTACHMENTS = 4;

export const COMPLAINT_TYPES = [
  { label: "Banking Service", value: "banking_service" },
  { label: "Card Service", value: "card_service" },
  { label: "Loan Service", value: "loan_service" },
  { label: "Digital Banking", value: "digital_banking" },
  { label: "Other", value: "other" },
] as const;

export const COMPLAINT_CATEGORIES = [
  { label: "Fraud", value: "fraud" },
  { label: "Delay", value: "delay" },
  { label: "Wrong Charges", value: "wrong_charges" },
  { label: "Poor Service", value: "poor_service" },
  { label: "System Issue", value: "system_issue" },
  { label: "Other", value: "other" },
] as const;

export const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;
