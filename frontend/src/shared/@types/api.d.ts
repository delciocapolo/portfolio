export interface IApiResponseError {
  field: PropertyKey | undefined;
  error: string;
}

export type IApiResponse<T> = {
  data: T;
  meta: {
    errors: IApiResponseError[] | null;
  };
};

export interface IApiPaginatedResponse<T> {
  data: Array<T>;
  meta: {
    errors: IApiResponseError[] | null;
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
