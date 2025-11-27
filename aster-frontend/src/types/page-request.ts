export type PageRequest<T> = {
  pageNumber: number;
  totalEntries: number;
  lastPage: number;
  content: T[];
};
