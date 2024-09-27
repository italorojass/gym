import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MantenedoresService {

  constructor(private httpClient: HttpClient) { }
  HOST = environment.HOST;

  disciplinas(){
    return this.httpClient.get(`${this.HOST}/keys/disciplinas`);

  }

  horarios(disciplinaID : any){
    console.log(`${this.HOST}/keys/horarios/${disciplinaID}`)
    return this.httpClient.get(`${this.HOST}/keys/horarios/${disciplinaID}`);

  }

  getComunas(){
    return this.httpClient.get(`${this.HOST}/keys/comunas`);
  }

  crearHorario(body : any){
    return this.httpClient.post(`${this.HOST}/horarios`,body)
  }


  crearAlumno(body : any){
    return this.httpClient.post(`${this.HOST}/alumno`,body)
  }
  updateAlumno(body : any){
    return this.httpClient.put(`${this.HOST}/alumno`,body)
  }
  getAlumnos(){
    return this.httpClient.get(`${this.HOST}/alumno`);
  }
  deleteAlumnos(id:number){
    return this.httpClient.delete(`${this.HOST}/alumno/${id}`);
  }

  getDias(){
    return this.httpClient.get(`${this.HOST}/dias`);
  }

  getHorarios(){
    return this.httpClient.get(`${this.HOST}/horarios`);
  }

  getInstructores(){
    return this.httpClient.get(`${this.HOST}/instructores`);

  }

  getWidgets(){
    return this.httpClient.get(`${this.HOST}/estadisticas`);

  }

}
