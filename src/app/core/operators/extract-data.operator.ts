import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse, PaginationMeta } from '@core/interfaces/paginated-response';

export function extractData<T>() {
  return (source: Observable<PaginatedResponse<T>>): Observable<T[]> => {
    return source.pipe(
      map(response => response.registros)
    );
  };
}

export function extractPagination<T>() {
  return (source: Observable<PaginatedResponse<T>>): Observable<PaginationMeta> => {
    return source.pipe(
      map(response => response.pagination)
    );
  };
}

export function extractDataWithPagination<T>() {
  return (source: Observable<PaginatedResponse<T>>): Observable<{ data: T[], pagination: PaginationMeta }> => {
    return source.pipe(
      map(response => ({
        data: response.registros,
        pagination: response.pagination
      }))
    );
  };
}
