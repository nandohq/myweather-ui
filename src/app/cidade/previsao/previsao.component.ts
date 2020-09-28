import { PrevisaoEntity } from './../previsao.entity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mw-previsao',
  templateUrl: './previsao.component.html',
  styleUrls: ['./previsao.component.css']
})
export class PrevisaoComponent implements OnInit {

  iconUrl = 'http://openweathermap.org/img/wn/';

  @Input() exibir = false;
  @Input() previsao: PrevisaoEntity;
  @Output() fechar = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  fecharModal(): void {
    this.previsao = null;
    this.fechar.emit({ exibir: false });
  }
}
