import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MantenedoresService } from '../../services/mantenedores.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { PlanesService } from 'src/app/administrador/mantenedor/services/planes.service';


export interface StudentData {
  alumno_id: number;
  alumno_nombre: string;
  alumno_apellido: string;
  alumno_comuna: string;
  alumno_contacto: string;
  alumno_contacto_emergencia: string;
  alumno_email: string;
  alumno_observaciones: string;
  dias: string;
  disciplinas: string;
  fecha_registro: string;
  fecha_renovacion: string;
  plan_nombre: string;
  plan_precio: string;
  IsOverdue: boolean;
}
@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit,AfterViewInit  {

  @Input() insertaAlumno = new Subject();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  inputBusqueda : any;
  displayedColumns: any= [
    'alumno_nombre',

    'alumno_comuna',
    'alumno_contacto',
    'alumno_email',
    'dias',
    'disciplinas',
    'fecha_registro',
    'fecha_renovacion',
    'plan_nombre',

    'IsOverdue',
    'alumno_observaciones',
    'acciones'];
    dataSource = new MatTableDataSource<StudentData>();

  constructor(private mantenedorSV :MantenedoresService, private planesSV: PlanesService){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAlumnos();
    this.getPlanes();
    if(this.insertaAlumno){
      this.insertaAlumno.subscribe(r=>{
        this.getAlumnos();
      })
    }
  }
  editingIndex: number | null = null;

  alumnos:any=[];
  today = new Date();
  getAlumnos(){
    this.mantenedorSV.getAlumnos().subscribe((r:any)=>{
      let result = r.map((alumno:any)=>{
        const today = new Date();
        const paymentDueDate = new Date(alumno.fecha_renovacion);
        alumno.nombreApellido = `${alumno.alumno_nombre} ${alumno.alumno_apellido}`;
         alumno.contactoCompleto = `${alumno.alumno_contacto} / ${alumno.alumno_contacto_emergencia}`
        // Agregar la propiedad IsOverdue basada en la comparación de fechas
        alumno.IsOverdue = paymentDueDate < today;

        return alumno;
      });
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    })
  }

  planes=[];
  getPlanes(){
    this.planesSV.getPlanes().subscribe((r:any)=>{
      this.planes=r;
      console.log(this.planes);
    })
  }

  onEdit(index:any,value:any){
    this.editingIndex = index;

    this.dataSelect = value;
    console.log(this.dataSelect);
    //value.disciplina.horario[0].dias = this.diasSelected;



  }
  dataSelect:any;
  stopEdit(): void {
    //this.dataSelect.responsable = this.userName;
    console.log(this.dataSelect);

    let body = {
      id : this.dataSelect.alumno_id,
      contacto_emergencia : this.dataSelect.alumno_contacto_emergencia,
      email : this.dataSelect.alumno_email,
      observaciones : this.dataSelect.alumno_observaciones
    }
    console.log(body);
    this.mantenedorSV.updateAlumno(body).subscribe(r=>{
      this.getAlumnos();
      this.editingIndex = null;
    })
  }
  onDelete(value:any){
    Swal.fire({
      title: `Estás por eliminar al alumno ${value.alumno_nombre} ${value.alumno_apellido} ? `,
      icon : `warning`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.mantenedorSV.deleteAlumnos(value.alumno_id).subscribe(r=>{

          Swal.fire(`Alumno ${value.alumno_nombre} ${value.alumno_apellido}`,'Eliminado correctamente.','success');
          this.getAlumnos();
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
