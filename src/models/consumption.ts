export interface Consumption {
  id: string | null;
  itemCode: string;
  description: string;
  UOM: string;
  issuedQty: number;
  returnedQty: number;
  wasteQty: number;
  remark: string | null;
  date: string;
}