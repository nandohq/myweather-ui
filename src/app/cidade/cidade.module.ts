import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastModule} from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MessageComponent } from './../message/message.component';
import { CidadeListComponent } from './cidade-list/cidade-list.component';
import { CidadeFormComponent } from './cidade-form/cidade-form.component';

import { PrevisaoComponent } from './previsao/previsao.component';

@NgModule({
  declarations: [CidadeListComponent, CidadeFormComponent, MessageComponent, PrevisaoComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    ToastModule,
    TableModule,
    DialogModule,
    MessageModule,
    ConfirmDialogModule,
    MessagesModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    AutoCompleteModule,
    InputTextareaModule,
  ],
  exports: [
    CidadeListComponent,
    CidadeFormComponent
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class CidadeModule { }
