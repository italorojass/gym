import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { RouterModule } from '@angular/router';
import { InstructoresComponent } from './mantenedor/instructores/instructores.component';
import { InicioComponent } from './inicio/inicio.component';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { HorariosComponent } from './mantenedor/horarios/horarios.component';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { DisciplinasComponent } from './mantenedor/disciplinas/disciplinas.component';
import { PlanesComponent } from './mantenedor/planes/planes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpInterceptorService } from '../interceptors/http-interceptor.service';


@NgModule({
  declarations: [
    InstructoresComponent,
    InicioComponent,
    HorariosComponent,
    MantenedorComponent,
    DisciplinasComponent,
    PlanesComponent
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    NgSelectModule,
    FlatpickrModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
  ]
})
export class AdministradorModule { }
