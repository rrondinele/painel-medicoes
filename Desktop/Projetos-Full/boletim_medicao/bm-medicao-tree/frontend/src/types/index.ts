export type DateRange = {
  from?: Date | null;
  to?: Date | null;
};

export interface Filters {
  concessionaria: string;
  status: string;
  dateRange: DateRange;
};