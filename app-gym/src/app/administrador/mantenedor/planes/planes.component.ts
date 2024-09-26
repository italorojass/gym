import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MantenedoresService } from 'src/app/shared/services/mantenedores.service';
import { PlanesService } from '../services/planes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private planSv: PlanesService,) {

  }
  ngOnInit(): void {
    this.getPlanes();
  }
  planes: any = [];
  tiposPlan :any=[ ];
  editingIndex: number | null = null;

  planesBase = [
    { nombre:'Semestral'},
    { nombre:'Trimestral'},
    { nombre:'Anual'},
    { nombre:'Mensual'}
  ];
  selectedPlan:any;
  getPlanes() {
    this.planSv.getPlanes().subscribe((r) => {
      this.planes = r;

      r.map((x:any)=>{
        let existe = this.planesBase.find(v=>v.nombre = x.duracion);
        if(!existe){
          this.tiposPlan.push(x.tipoPlan);
        }

      })
    })
  }
  formPlanes = this.fb.group({
    plan: ['Plan', Validators.required],
    tipo: ['', Validators.required],
    precio: ['', Validators.required]
  });
  dataSelect : any;
  onEdit(index:any,value:any){
    this.editingIndex = index;

    this.dataSelect = value;

  }

  stopEdit(): void {
    //this.dataSelect.responsable = this.userName;
    if(this.dataSelect.precio){
      this.planSv.updatePlan(this.dataSelect.id,{precio : this.dataSelect.precio}).subscribe(r=>{

        Swal.fire(`Plan`,'Actualizado correctamente.','success');
        this.getPlanes();
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
      title: "Esta seguro que desea eliminar el plan "+value.duracion+"?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.planSv.deletePlan(value.id).subscribe(r=>{

          Swal.fire(`Plan ${value.tipo}`,'Eliminado correctamente.','success');
          this.getPlanes();
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

  submit() {
    this.planSv.createPlan(this.formPlanes.value).subscribe(r=>{
      this.getPlanes();


      Swal.fire('Nuevo plan','Agregado correctamente.','success')
      this.formPlanes.reset({plan : 'Plan'})
    })
  }
}
