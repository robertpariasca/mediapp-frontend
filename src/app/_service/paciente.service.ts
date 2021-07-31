import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Paciente } from '../_model/paciente';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente>{

  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();
  
  //private url: string = `${environment.HOST}/pacientes`;  //ES6  Template Strings ``
  //constructor(private http: HttpClient) { }

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/pacientes`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

 /* listar() {
    //return this.http.get(environment.HOST + "/pacientes");
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  registrar(paciente: Paciente) {
    return this.http.post(this.url, paciente);
  }

  modificar(paciente: Paciente) {
    return this.http.put(this.url, paciente);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  } */

  //////////////////////////
  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }

  setPacientecambio(lista: Paciente[]) {
    this.pacienteCambio.next(lista);
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

}
