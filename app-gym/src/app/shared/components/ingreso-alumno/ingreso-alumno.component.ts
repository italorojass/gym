import { PlanesService } from './../../../administrador/mantenedor/services/planes.service';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, Validators } from '@angular/forms';
import { MantenedoresService } from '../../services/mantenedores.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { DisciplinasService } from 'src/app/administrador/mantenedor/services/disciplinas.service';
@Component({
  selector: 'app-ingreso-alumno',
  templateUrl: './ingreso-alumno.component.html',
  styleUrls: ['./ingreso-alumno.component.css']
})
export class IngresoAlumnoComponent implements OnInit{
    constructor(private fb : FormBuilder,
      private mansv : MantenedoresService,
      private disciplinaSV: DisciplinasService,
      private PlanesService : PlanesService,
      private toastr: ToastrService
    ){

    }

    ngOnInit(): void {
        this.getDisciplinas();
        this.getHorarios();
        this.getComunas();

    }
    selectedDisciplina : any;
    selectedHorario : any;
    selectedComuna:any;
    formNuevoAlumno = this.fb.group({
      nombre : ['',Validators.required],
      apellido : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]],
      telefono : ['',Validators.required],
      telefono_emergencia : [''],
      direccion : [''],
      comuna : [''],
      disciplina : ['',Validators.required],
      plan : ['',Validators.required],
      observaciones :['']
    });

    comunas:any=[];
    getComunas(){
      this.mansv.getComunas().subscribe(r=>{
        this.comunas = r;
      })
    }

    saveAlumno = new Subject<any>();
    submit(){
     // console.log(this.formNuevoAlumno.value);
      let data = this.formNuevoAlumno.value;
      const today = new Date();

      let body = {
        ...data,
        fecha_registro : moment(today).format('YYYY/MM/DD'),

      }
      console.log(body);
      this.mansv.crearAlumno(body).subscribe((r:any)=>{
        console.log(r);
        this.formNuevoAlumno.reset();
        this.toastr.success('', r.message);
        this.saveAlumno.next(r);
      })
    }

    disciplinas :any = [];
    getDisciplinas(){
      this.disciplinaSV.getDisciplinas2().subscribe((r:any)=>{
        console.log('response disciplina',r);
        this.disciplinas = r.map((x:any)=>{
          let body = {
            nombre:`${x.disciplina.nombre} - ${x.disciplina.horario[0].dias} - ${x.disciplina.horario[0].hora}`,
            id : x.disciplina.id
          };
          return body;
      });
        //console.log(this.disciplinas);
      })
    }


    horarios=[];
    getHorarios(){
      this.PlanesService.getPlanes().subscribe((r:any)=>{
        this.horarios=r.map((x:any)=>{

          let body={
            ...x,
            nombrePlan : `${x.duracion} - $${Number(x.precio)}`
          }
          return body;
        });
      })
    }

}
