import { MessageService } from 'primeng/api';
import { CidadeEntity } from './../cidade.entity';
import { FilterParams } from './../../utils/filter/filter.params';
import { CidadeDto } from './../cidade.dto';
import { PaisEntity } from './../../pais/pais.entity';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CidadeService } from './../cidade.service';
import { PaisService } from 'src/app/pais/pais.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mw-cidade-form',
  templateUrl: './cidade-form.component.html',
  styleUrls: ['./cidade-form.component.css']
})
export class CidadeFormComponent implements OnInit {

  form: FormGroup;

  cidadeId: number;

  sugestoesPaises: PaisEntity[];
  sugestoesCidades: CidadeEntity[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private paisService: PaisService,
    private cidadeService: CidadeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cidadeId = this.route.snapshot.params.id;

    this.configForm();
    this.configChanges();

    this.buscarEdicao();
  }

  private configForm(): void {
    this.form = this.formBuilder.group({
      descricao: [{ value: null, disabled: true} ],
      id: [],
      label: [],
      nome: [{ value: null, disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      pais: this.formBuilder.group({
        id: [null, Validators.required],
        label: [],
        nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        sigla2: [null, Validators.maxLength(2)],
        sigla3: [null, Validators.maxLength(3)]
      })
    });
  }

  private configFormOnEdit(cidade: CidadeEntity): void {
      this.form.controls.pais.patchValue(cidade.pais);
      this.form.controls.id.setValue(cidade.id);
      this.form.controls.nome.setValue(cidade.nome);
      this.form.controls.descricao.setValue(cidade.descricao);
      this.form.controls.label.setValue(cidade.label);
  }

  private configChanges(): void {
    this.form.controls.pais.valueChanges.subscribe(pais => {
      if (pais && pais.id) {
        this.form.controls.nome.reset();
        this.form.controls.nome.enable();
        this.form.controls.descricao.enable();
      } else {
        this.form.controls.nome.disable();
        this.form.controls.descricao.disable();
      }
    });
  }

  isNew(): boolean {
    return this.cidadeId === undefined;
  }

  buscarEdicao(): void {
    if (!this.cidadeId) {
      return;
    }

    this.cidadeService.obterUma(this.cidadeId).subscribe((cidade: CidadeEntity) => {
      this.configFormOnEdit(cidade);
    });
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
    this.sugestoesCidades = [];
  }

  sugerirCidade(event: any): void {
    let { query } = event;
    query += `,${this.form.controls.pais.value.sigla2}`;

    this.cidadeService.consultar(query).subscribe((response: any[]) => {
      if (response) {
        this.sugestoesCidades = response.map((cidade: CidadeDto) => {
          const entity: CidadeEntity = {
            id : cidade.id,
            nome : cidade.name,
            pais : this.form.controls.pais.value,
            label : `${cidade.id} - ${cidade.name} (${cidade.country})`
          };

          return entity;
        });
      }
    });
  }

  selecionarCidade(cidade: CidadeEntity): void {
    this.form.patchValue(cidade, { emitEvent : false });
  }

  limparCidade(): void {
    this.form.controls.id.setValue(null);
    this.form.controls.nome.setValue(null);
    this.form.controls.descricao.setValue(null);
  }

  checarCampo(control: AbstractControl): void {
    control.markAsTouched();
  }

  pesquisar(): void {
    this.router.navigate(['/cidades']);
  }

  salvar(): void {
    this.validateAllFormFields(this.form);

    if (this.form.invalid) {
      return;
    }

    if (this.isNew()) {
      this.cidadeService.salvar(this.form.getRawValue()).subscribe((cidade: CidadeEntity) => {
        const message = `A cidade "${cidade.nome}" foi cadastrada com sucesso`;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message});

        setTimeout(() => this.router.navigate(['/cidade/', cidade.id]), 1500);
      });
    } else {
      this.cidadeService.atualizar(this.form.getRawValue()).subscribe((cidade: CidadeEntity) => {
        const message = `A cidade "${cidade.nome}" foi atualizada com sucesso`;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message});

        setTimeout(() => this.router.navigate(['/cidades']), 1000);
      });
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
