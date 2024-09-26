import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MantenedoresService } from 'src/app/shared/services/mantenedores.service';
import { DisciplinasService } from '../services/disciplinas.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css']
})
export class DisciplinasComponent implements OnInit{
  constructor(private fb : FormBuilder,
    private mansv : MantenedoresService,
    private disciplinasSV : DisciplinasService,
    private toastr: ToastrService){

  }

  selectedHorario : any;
  selectedDias : any;
  selectedInstructor : any;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  formDisciplina = this.fb.group({
    disciplina :['',Validators.required],
    descripcion : [''],
    dias : [''],
    horarios : ['',Validators.required],
    instructores : ['',Validators.required]
  })
  ngOnInit(): void {
    this.getDias();
    this.getDisciplinas();

    this.getHorarios();
    this.getInstructores();
  }

  submit(){
    console.log(this.formDisciplina.value);
    this.disciplinasSV.createDisciplina(this.formDisciplina.value).subscribe(r=>{
      this.getDisciplinas();
      Swal.fire(`Disciplina ${this.formDisciplina.value.disciplina}`,'Creada correctamente','success')
    })
  }

  disciplinas :any = [];
  editingIndex: number | null = null;

  getDisciplinas(){
    this.disciplinasSV.getDisciplinas2().subscribe((r:any)=>{
      console.log('response disciplinas',r);
      this.disciplinas = r;
      this.dataSource = new MatTableDataSource(r);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  horarios : any=[];

  getHorarios(){
    this.mansv.getHorarios().subscribe(r=>{
      this.horarios= r;
    })
  }

  dias:any=[];
  getDias(){
    this.mansv.getDias().subscribe(r=>{
      console.log(r);
      this.dias= r;
    })
  }

  mergeArrays(dias: any[], selected: string[]): any[] {
    console.log('dias',dias)
    console.log('horario seleccionado',selected)
    return dias.map(dia => {
      return {
        ...dia,
        existe: selected.includes(dia.nombre)
      };
    });
  }

  mergeInstructores(arrayOrigen: any[], selected: string[]): any[] {
    console.log('origen',arrayOrigen)
    console.log('seleccionado',selected)
    return arrayOrigen.map(value => {
      return {
        ...value,
        existe: selected.includes(value.nombre)
      };
    });
  }


  instructores :any= [];
  getInstructores(){
    this.mansv.getInstructores().subscribe((r:any)=>{
      this.instructores= r.map((x:any)=>{
        return {
         ...x,
         nombreCompleto : `${x.nombre} ${x.apellido}`
        }
      });
    })
  }
  dataSelect:any;
  mergedDiasArray:any;
  mergedInstructores:any;
  diasSelected : any;
  onEdit(index:any,value:any){
    this.editingIndex = index;

    this.dataSelect = value;
    console.log(this.dataSelect);
    this.mergedDiasArray = this.mergeArrays(this.dias, this.dataSelect.disciplina.horario[0].dias);
    console.log(this.mergedDiasArray);
    this.diasSelected = this.mergedDiasArray.filter((x:any)=>!x.existe);
    //value.disciplina.horario[0].dias = this.diasSelected;

    this.mergedInstructores = this.mergeInstructores(this.instructores,this.dataSelect.disciplina.instructores);
    console.log(this.mergedInstructores);

  }

  stopEdit(): void {
    //this.dataSelect.responsable = this.userName;
    console.log(this.dataSelect);
    if(this.dataSelect.precio){
      this.disciplinasSV.updateDisciplina(this.dataSelect.disciplina.id,this.dataSelect).subscribe(r=>{

        Swal.fire(`Disciplina ${this.dataSelect.disciplina.nombre}`,'Actualizado correctamente.','success');
        this.getDisciplinas();
        this.editingIndex = null;
      })
    }else{
      Swal.fire({
        title: "Campo vacío",
        text: "Debes agregar un valor para homologar",
        icon: "warning"
      });
    }

  }
  onDelete(value:any){
    Swal.fire({
      title: "Esta seguro que desea eliminar la disciplina "+value.disciplina.nombre+"?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.disciplinasSV.deleteDisciplina(value.disciplina.id).subscribe(r=>{

          Swal.fire(`Disciplina ${value.disciplina.nombre}`,'Eliminada correctamente.','success');
          this.getDisciplinas();
        })
      } else if (result.isDenied) {
       // Swal.fire("Changes are not saved", "", "info");
      }
    });


  }

  cancel(i:number){
    this.editingIndex=null;
    console.log(this.dataSelect)

  }


}
