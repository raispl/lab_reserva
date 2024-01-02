import { Component, OnInit } from '@angular/core';
import { LabService } from '../model/lab.service';

@Component({
  selector: 'app-reservas', // ou 'app-barra-superior'
  templateUrl: './reservar.component.html', // ou template da barra superior
  styleUrls: ['./reservar.component.css'], // ou estilos da barra superior 
})
export class ReservarComponent implements OnInit {
  usuarioLogado: string = '';
  nomeUsuario: string = '';
  laboratorioAtual: string = '';
  tituloFormulario: string = '';

  formularioLabRedes: any; // Declare these properties
  formularioLab1: any;
  formularioLab2: any;
  formularioLab3: any;
  formularioLab4: any;

  reservasLaboratorio: any[] = [];

  mensagemErroReserva: string = '';
  

  constructor(private usuarioService: LabService) { }

  ngOnInit() {
    this.usuarioLogado = localStorage.getItem('logado') + '';

    this.usuarioService.getNomeUsuario(this.usuarioLogado).subscribe(
      (resposta: any) => {
        if (resposta.status) {
          this.nomeUsuario = resposta.nome;
        } else {
          console.error(resposta.mensagem);
        }
      },
      (erro) => {
        console.error('Erro ao obter o nome do usuário:', erro);
      }
    );
  }

  exibirFormCalen(laboratorio: string): void {
    const formularios = document.querySelectorAll('.formulario-container');
    formularios.forEach(formulario => {
      if (formulario instanceof HTMLElement) {
        formulario.style.display = 'none';
      }
    });

    const calendarios = document.querySelectorAll('.calendario-container');
    calendarios.forEach(calendario => {
      if (calendario instanceof HTMLElement) {
        calendario.style.display = 'none';
      }
    });

    const formularioAtual = document.getElementById(`formulario${laboratorio}`);
    if (formularioAtual instanceof HTMLElement) {
      formularioAtual.style.display = 'block';

      const calendarioAtual = document.getElementById(`calendario${laboratorio}`);
      if (calendarioAtual instanceof HTMLElement) {
        calendarioAtual.style.display = 'block';
      }
    }

    this.laboratorioAtual = laboratorio;

    // Limpe as reservas ao exibir um novo laboratório
    this.reservasLaboratorio = [];

    // Carregue as reservas para o laboratório atual
    this.carregarReservasLaboratorio();

    this.mensagemErroReserva = '';
  }


  // ...
  reservarLaboratorio(labId: string, formulario: any) {
    const id_lab = this.obterIdLab(labId);

    if (id_lab === undefined) {
      console.error('Laboratório não reconhecido:', labId);
      return;
    }

    // Verifique se os campos obrigatórios estão preenchidos
    if (
      formulario.value.dataInicio &&
      formulario.value.horaInicio &&
      formulario.value.horaFim &&
      formulario.value.justificativa
    ) {
      const reservaData = {
        dataInicio: formulario.value.dataInicio,
        horaInicio: formulario.value.horaInicio,
        horaFim: formulario.value.horaFim,
        justificativa: formulario.value.justificativa,
        id_lab: id_lab,
        matricula: this.usuarioService.getUsuarioLogado()
      };

      this.usuarioService.reservarLaboratorio(labId, reservaData).subscribe(
        (resposta) => {
          console.log('Resposta da reserva:', resposta);

          // Limpa os campos do formulário de reserva
          formulario.reset();

          // Limpa a mensagem de erro se houver
          this.mensagemErroReserva = '';
        },
        (erro) => {
          console.error('Erro ao reservar laboratório:', erro);
        }
      );
    } else {
      this.mensagemErroReserva = 'Preencha todos os campos. É obrigatório';
      console.error('Preencha todos os campos obrigatórios.');
    }
  }

  carregarReservasLaboratorio(): void {
    const id_lab = this.obterIdLab(this.laboratorioAtual);

    if (id_lab !== undefined) {
      this.usuarioService.getReservasPorLab(id_lab).subscribe(
        (resposta: any) => {
          if (resposta.status) {
            this.reservasLaboratorio = resposta.reservas;
          } else {
            console.error(resposta.mensagem);
          }
        },
        (erro) => {
          console.error('Erro ao obter reservas do laboratório:', erro);
        }
      );
    }
  }

  obterIdLab(laboratorio: string): number | undefined {
    switch (laboratorio) {
      case 'LabRedes':
        return 5;
      case 'Lab1':
        return 1;
      case 'Lab2':
        return 2;
      case 'Lab3':
        return 3;
      case 'Lab4':
        return 4;
      default:
        console.error('Laboratório não reconhecido:', laboratorio);
        return undefined;
    }
  }



}