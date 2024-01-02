import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ReservarComponent } from './reservar/reservar.component';

const routes: Routes = [
  {path: 'inicio', component:InicioComponent},
  {path: 'reservar', component: ReservarComponent},
  {path: '', redirectTo: '/inicio', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
