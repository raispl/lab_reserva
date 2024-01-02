import { Component } from '@angular/core';
import { LabService } from '../model/lab.service';
import { NgForm } from '@angular/forms'; // Importe NgForm para obter acesso ao formulário
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  usuario = {
    matricula: '',
    nome: '',
    senha: '',
  };
  usuarioLogado: string = '';
  loginForm: any;
  mensagemErro: string = ''; // Adicione essa variável
  mensagemErroLogin: string = ''

  constructor(public usuarioService: LabService, private router: Router) { }

  mostrarCadastro(event: Event) {
    event.preventDefault();
    this.mensagemErro = '';
    this.mensagemErroLogin = ''
    this.usuario.matricula = '';
    this.usuario.senha = '';

    const loginContainer = document.querySelector('.login-container') as HTMLElement | null;
    const signupContainer = document.querySelector('.signup-container') as HTMLElement | null;

    if (loginContainer && signupContainer) {
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'block';
    }
  }

  mostrarLogin() {
    this.mensagemErro = '';
    this.usuario.matricula = '';
    this.usuario.senha = '';
    const loginContainer = document.querySelector('.login-container') as HTMLElement | null;
    const signupContainer = document.querySelector('.signup-container') as HTMLElement | null;

    if (loginContainer && signupContainer) {
      loginContainer.style.display = 'block';
      signupContainer.style.display = 'none';
    }
  }

  cadastrarUsuario() {
    // Verifique se os campos obrigatórios estão preenchidos
    if (this.usuario.nome && this.usuario.matricula && this.usuario.senha) {
      // Chame o serviço para cadastrar o usuário
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe(
        (response) => {
          console.log('Usuário cadastrado com sucesso', response);
          // Adicione aqui qualquer lógica adicional após o cadastro bem-sucedido
        },
        (error) => {
          console.error('Erro ao cadastrar usuário', error);
          this.mensagemErro = 'Erro ao cadastrar usuário'; // Defina a mensagem de erro
          // Adicione aqui qualquer lógica adicional para lidar com erros de cadastro
        }
      );

      // Limpe os campos após o cadastro
      this.usuario.matricula = '';
      this.usuario.nome = '';
      this.usuario.senha = '';

      // Execute outras ações necessárias após o cadastro
      this.mostrarLogin();
    } else {
      // Se algum campo obrigatório não estiver preenchido, exiba uma mensagem de erro
      this.mensagemErro = 'Preencha todos os campos. É obrigatório.';
    }
  }

  fazerLogin(event: Event) {
    event.preventDefault();

    const credenciais = { matricula: this.usuario.matricula, senha: this.usuario.senha };

    this.usuarioService.realizarLogin(credenciais)
      .subscribe(response => {
        console.log('Resposta do login:', response);

        if (response.status) {
          console.log('Login bem-sucedido. Redirecionando...');
          this.router.navigate(['/reservar']);
        } else {
          console.log('Credenciais incorretas.');
          this.mensagemErroLogin = 'Matrícula ou senha incorretas. Por favor, tente novamente.';
          this.usuarioService.setMensagemErro(response.mensagem);
        }
      }, error => {
        console.error('Erro na requisição de login:', error);
      });
  }


}
