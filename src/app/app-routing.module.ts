import { CidadeFormComponent } from './cidade/cidade-form/cidade-form.component';
import { CidadeListComponent } from './cidade/cidade-list/cidade-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'cidades', pathMatch: 'full' },
  { path: 'cidades', component: CidadeListComponent },
  { path: 'cidade/:id', component: CidadeFormComponent },
  { path: 'cidades/nova', component: CidadeFormComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
