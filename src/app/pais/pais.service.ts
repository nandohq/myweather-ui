import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PaisEntity } from './pais.entity';
import { FilterParams } from './../utils/filter/filter.params';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private url = 'http://localhost:8080/paises';

  constructor(private http: HttpClient) {}

  /**
   * Consulta os países da atualidade a partir de um conjunto de filtros
   * @param filterParams FilterParams Objeto de parâmetros da consulta
   * @returns Observable Observable da lista de retorno
   */
  pesquisar(filterParams: FilterParams): Observable<any> {
    const params = this.getHttpParams(filterParams);
    const endpoint = this.url + (filterParams.filter ? `?${filterParams.filter}` : '');

    return this.http.get<PaisEntity>(`${endpoint}`,  { params }).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Monta um conjunto de parâmetros http a partir do objeto de parâmetros da consulta
   * @param params FilterParams Objeto de parâmetros da consulta
   * @returns HttpParams Parâmetros http a serem passados para o endpoint
   */
  private getHttpParams(params: FilterParams): HttpParams {
    const httpParams = new HttpParams();
    const { page, size, sortField } = params;

    return httpParams.append('page', page.toString())
                            .append('size', size.toString())
                            .append('sort', sortField);
  }

  /**
   * Trata erros lançados ao chamar API's
   * @param error HttpErrorResponse Erro lançado pelo endopoint chamado
   */
  handleError(error: HttpErrorResponse): Observable<any> {
    let message = '';
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      message = `Erro ${error.status}: ${error.message}`;
    }

    return throwError(message);
  }
}
