import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  lockClosedOutline,
  eyeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  usuario: string = '';
  password: string = '';
  recordar: boolean = false;
  mostrarContrasena: boolean = false;
  mensajeError: string = '';

  constructor(private router: Router) {
    addIcons({
      personCircleOutline,
      lockClosedOutline,
      eyeOutline
    });
  }

  ngOnInit() {
    this.limpiarCampos();
  }

  ionViewWillEnter() {
    this.limpiarCampos();
  }

  limpiarCampos() {
    this.usuario = '';
    this.password = '';
    this.recordar = false;
    this.mostrarContrasena = false;
    this.mensajeError = '';
  }

  togglePassword() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  login() {
    this.mensajeError = '';

    if (!this.usuario || !this.password) {
      this.mensajeError = 'Completa usuario y contraseña.';
      return;
    }

    if (this.usuario === 'admin' && this.password === '123456') {
      localStorage.setItem('usuarioBryale', JSON.stringify({
        id_usuario: 1,
        nombre: 'Administrador',
        usuario: 'admin',
        rol: 'Administrador',
        estado: 'Activo'
      }));

      this.router.navigateByUrl('/panel', { replaceUrl: true });
    } else {
      this.mensajeError = 'Usuario o contraseña incorrectos.';
    }
  }
}