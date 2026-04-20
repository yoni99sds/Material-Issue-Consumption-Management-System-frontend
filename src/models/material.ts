export interface MaterialIssueHeader {
  id: string | null;
  date: string;
  machine: string;
  workOrderNo: string;
  jobDescription: string | null;
  shift: string;
  operator: string;
  status: "pending" | "approved" | "rejected";
}

export interface MaterialIssueRow {
  sn: number;
  description: string;
  rollNo: string;
  width: number;
  weight: number;
  issuedLength: number;
  waste: number;
  actualSheetProduced: number;
  sheetSize: string;
}