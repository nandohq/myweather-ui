import { PrevisaoEntity } from './previsao.entity';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

import { FilterParams } from './../utils/filter/filter.params';
import { CidadeDto } from './cidade.dto';
import { CidadeEntity } from './cidade.entity';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  private url = 'http://localhost:8080/cidades';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /**
   * Salva uma nova cidade
   * @param cidade CidadeEntity Cidade a ser salva
   */
  salvar(cidade: CidadeEntity): Observable<CidadeEntity> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.post<CidadeEntity>(this.url, JSON.stringify(cidade), { headers }).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Atualiza uma cidade existente
   * @param cidade CidadeEntity Cidade a ser atualizada
   */
  atualizar(cidade:  CidadeEntity): Observable<CidadeEntity> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const endpoint = `${this.url}/${cidade.id}`;

    return this.http.put<CidadeEntity>(endpoint, JSON.stringify(cidade), { headers }).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Exclui uma cidade anteriormente cadastrada
   * @param id number Identificador da cidade
   */
  excluir(id: number): Observable<CidadeEntity> {
    return this.http.delete<CidadeEntity>(`${this.url}/${id}`).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Consulta a cidade que está sendo cadastrada na base de dados da API OpenWeather
   * @param nome string Nome da cidade que está sendo cadastrada
   * @returns Observable Observable de CidadeDto
   */
  consultar(nome: string): Observable<any> {
    const endpoint = `http://localhost:4200/api/city?query=${nome}`;
    const headers = new HttpHeaders().append('Access-Control-Allow-Origin', '*');

    return this.http.get<CidadeDto>(`${endpoint}`, { headers }).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Consulta as cidades cadastradas a partir de um conjunto de filtros
   * @param filterParams FilterParams Objeto de parâmetros da consulta
   * @returns Observable Observable da lista de retorno
   */
  pesquisar(filterParams: FilterParams): Observable<any> {
    const params = this.getHttpParams(filterParams);
    const endpoint = this.url + (filterParams.filter ? `?${filterParams.filter}` : '');

    return this.http.get<CidadeEntity>(`${endpoint}`,  { params }).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Retorna uma cidade
   * @param id number Identificador da cidade
   */
  obterUma(id: number): Observable<CidadeEntity> {
    return this.http.get<CidadeEntity>(`${this.url}/${id}`).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Retorna a previsão do tempo para os próximos 6 dias para a cidade atual
   * @param id number Identificador da cidade
   */
  obterPrevisao(id: number): Observable<PrevisaoEntity> {
    return this.http.get<CidadeEntity>(`${this.url}/${id}/previsao`).pipe(catchError(error => this.handleError(error)));
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

    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message});
    return throwError(message);
  }
}
