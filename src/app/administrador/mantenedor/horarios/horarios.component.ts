import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MantenedoresService } from 'src/app/shared/services/mantenedores.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit{
  formHorario =this.fb.group({
    dias : ['',Validators.required],
    horas : ['',Validators.required]
  });
  selectedDias : any='';
  selectedHorario : any='';
  ngOnInit(): void {
    this.getDias();
    this.getHorarios();
  }

  constructor(private fb : FormBuilder,
    private mansv : MantenedoresService,){

  }


  submit(){
    this.mansv.crearHorario(this.formHorario.value).subscribe(r=>{
      this.getHorarios();
    })
  }

  horarios : any=[];

  getHorarios(){
    this.mansv.getHorarios().subscribe(r=>{
      console.log(r);
      this.horarios= r;
    })
  }

  dias:any=[];
  getDias(){
    this.mansv.getDias().subscribe(r=>{
      this.dias= r;
    })
  }
}
