import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  usuarioLogado: string = ''; // Armazenará informações do usuário logado
  URL = 'http://localhost:3000'; // Substitua pelo endereço do seu backend

  mensagemErro: string = ''; // Atributo para armazenar a mensagem de erro
  usuarioService: any;

  setMensagemErro(mensagem: string): void {
    this.mensagemErro = mensagem;
  }
  getMensagemErro(): string {
    return this.mensagemErro;
  }

  constructor(private http: HttpClient, private router: Router) { }

  cadastrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.URL}/usuarios`, usuario);
  }

  realizarLogin(credenciais: any): Observable<any> {
    return this.http.post(`${this.URL}/login`, credenciais)
      .pipe(
        tap((resposta: any) => {
          console.log('Resposta do login:', resposta);

          if (resposta.status) {
            console.log('Login bem-sucedido. Redirecionando...');
            this.usuarioLogado = credenciais.matricula;
            localStorage.setItem('logado', this.usuarioLogado);
            this.router.navigate(['/reservar']);
          } else {
            console.log('Credenciais incorretas.');
            this.setMensagemErro(resposta.mensagem);
          }
        })
      );
  }

  getUsuarioLogado(): any {
    console.log('getUsuarioLogado chamado. Usuário logado:', this.usuarioLogado);
    return this.usuarioLogado;

  }

  getNomeUsuario(matricula: string): Observable<any> {
    return this.http.get(`${this.URL}/usuarios/${matricula}`);
  }

  reservarLaboratorio(labId: string, reservaData: any): Observable<any> {
    // Obtenha a matrícula do usuário logado diretamente do serviço
    const matricula = localStorage.getItem('logado') + '';

    // Adicione a matrícula ao objeto de dados de reserva
    reservaData.matricula = matricula;

    // Faça a requisição para reservar o laboratório, incluindo a matrícula no corpo
    return this.http.post(`${this.URL}/reservas`, reservaData);
  }

  getReservasPorLab(id_lab: number): Observable<any> {
    return this.http.get(`${this.URL}/reservas/${id_lab}`);
  }

}




