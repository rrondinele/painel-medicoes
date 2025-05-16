export type DateRange = {
  from?: Date;
  to?: Date;
};

export interface Filters {
  concessionaria: string;
  status: string;
  dateRange: DateRange;
};