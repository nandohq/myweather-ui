import { PrevisaoEntity } from './../previsao.entity';
import { CidadeEntity } from './../cidade.entity';
import { PaisEntity } from './../../pais/pais.entity';
import { FilterParams } from './../../utils/filter/filter.params';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { CidadeService } from './../cidade.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaisService } from 'src/app/pais/pais.service';
import { MenuItem } from 'primeng/api';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mw-cidade-list',
  templateUrl: './cidade-list.component.html',
  styleUrls: ['./cidade-list.component.css']
})
export class CidadeListComponent implements OnInit {

  form: FormGroup;

  total = 0;
  filter = new FilterParams();
  previsao: PrevisaoEntity;

  exibirPrevisao = false;

  sugestoesPaises: PaisEntity[];
  cidadesRetornadas: CidadeEntity[];
  acoes: MenuItem[];

  @ViewChild('mwtable') table: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private paisService: PaisService,
    private cidadeService: CidadeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.configForm();
  }

  private configForm(): void {
    this.form = this.formBuilder.group({
      pais: this.formBuilder.group({
        id: []
      }),
      nome: [],
      descricao: [],
    });
  }

  getAcoes(cidade: CidadeEntity): MenuItem[] {
    return [
      { label: 'Editar', icon: 'fas fa-edit', command: () => this.router.navigate(['/cidade', cidade.id]) },
      { label: 'Excluir', icon: 'fas fa-times', command: () => this.confirmarExclusao(cidade)}
    ];
  }

  sugerirPais(event: any): void {
    const { query } = event;
    const params = new FilterParams();
    params.filter = `nome=${query}`;

    this.paisService.pesquisar(params).subscribe(response => {
      const { content } = response;
      if (content) {
        this.sugestoesPaises = content.map(pais => {
          const entity: PaisEntity = { ...pais };
          entity.label = `${pais.sigla2} - ${pais.nome}`;
          return entity;
        });
      }
    });
  }

  selecionarPais(pais: PaisEntity): void {
    this.form.controls.pais.patchValue(pais);
  }

  limparPais(): void {
    this.form.reset();
    this.sugestoesPaises = [];
  }

  checarCampo(control: AbstractControl): void {
    control.markAsTouched();
  }

  filtrar(): void {
    this.montarFiltro();
    this.pesquisar();
  }

  limpar(): void {
    this.form.reset();
    this.filter = new FilterParams();
  }

  montarFiltro(): void {
    let filterQuery = '';
    this.filter = new FilterParams();

    const pais = this.form.controls.pais.value.id;
    const cidade = this.form.controls.nome.value;
    const descricao = this.form.controls.descricao.value;

    if (pais) {
      filterQuery = `pais=${pais}`;
    }

    if (cidade) {
      const query = filterQuery ? `&nome=${cidade}` : `nome=${cidade}`;
      filterQuery += query;
    }

    if (descricao) {
      const query = filterQuery ? `&descricao=${descricao}` : `descricao=${descricao}`;
      filterQuery += query;
    }

    this.filter.filter = filterQuery;
  }

  pesquisar(): void {
    this.cidadeService.pesquisar(this.filter).subscribe(response => {
      const { content } = response;
      this.total = response.totalElements;

      if (content) {
        this.cidadesRetornadas = content.map(cidade => {
          const entity: CidadeEntity = { ...cidade };
          return entity;
        });
      }
    });
  }

  obterPrevisao(id: number): void {
    this.cidadeService.obterPrevisao(id).subscribe((previsao: PrevisaoEntity) => {
      this.previsao = { ... previsao };
      this.exibirPrevisao = true;
    });
  }

  fecharModal(event: any): void {
    this.exibirPrevisao = event.exibir;
  }

  nova(): void {
    this.router.navigate(['/cidades/nova']);
  }

  trocarPagina(event: LazyLoadEvent): void {
    const { first, rows } = event;
    const page = first / rows;

    this.filter.page = page;
    this.filter.size = rows;

    this.pesquisar();
  }

  confirmarExclusao(cidade: CidadeEntity): void {
    this.confirmationService.confirm({
      message: `Deseja excluir a cidade ${cidade.nome}?`,
      accept: () => {
        this.cidadeService.excluir(cidade.id).subscribe(response => {

          if (this.table.first === 0) {
            this.pesquisar();
          } else {
            this.table.first = 0;
          }

          const message = `A cidade "${cidade.nome}" foi excluída com sucesso`;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message});
        });
      }
    });
  }
}
