import { ActivatedRoute, Router, Params } from '@angular/router';
import { SignosService } from './../../../_service/signos.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Signos } from './../../../_model/signos';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from 'src/app/_service/paciente.service';
import * as moment from 'moment';


@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;
  id: number;
  signos: Signos;
  form: FormGroup;
  edicion: boolean = false;

  maxFecha: Date = new Date();

  constructor(
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.listarPacientes();
    this.signos = new Signos();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'pulso' : new FormControl(''),
      'ritmoRespiratorio' : new FormControl(''),
      'temperatura' : new FormControl(''),
      'fecha' : new FormControl(this.maxFecha),
      'pacienteSelect': new FormControl()
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(data => {
        let id = data.idSignos;
        let idPaciente = data.paciente.idPaciente;
        let pulso = data.pulso;
        let ritmoRespiratorio = data.ritmoRespiratorio;
        let temperatura = data.temperatura;
        let fecha = data.fecha;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'pulso' : new FormControl(pulso),
          'ritmoRespiratorio' : new FormControl(ritmoRespiratorio),
          'temperatura' : new FormControl(temperatura),
          'fecha': new FormControl(fecha),
          'pacienteSelect' : new FormControl(idPaciente)
        });

      });
    }
  }

  operar() {
    this.signos.idSignos = this.form.value['id'];
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['pacienteSelect'];
    this.signos.paciente = paciente;
    this.signos.pulso = this.form.value['pulso'];
    this.signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    this.signos.temperatura = this.form.value['temperatura'];
    this.signos.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');;

    if (this.signos != null && this.signos.idSignos > 0) {
      //BUENA PRACTICA
      this.signosService.modificar(this.signos).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio("Se modificó");
      });

    } else {
      //PRACTICA COMUN
      this.signosService.registrar(this.signos).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio("Se registró");
      });

/*
      this.signosService.registrar(this.signos).subscribe(data => {
        this.signosService.listar().subscribe(signos => {
          this.signosService.setSignosCambio(signos);
          this.signosService.setMensajeCambio("Se registró");
        });
      });
      */
    }

    this.router.navigate(['pages/signos']);
  }

  listarPacientes() {
    //this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.pacientes$ = this.pacienteService.listar();
  }

}
