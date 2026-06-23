import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class CambiarPasswordPage {

  passwordActual = '';
  passwordNueva = '';
  passwordConfirmar = '';

  verActual = false;
  verNueva = false;
  verConfirmar = false;

  mensaje = '';

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  regresar() {
    this.router.navigate(['/perfil']);
  }

  guardarPassword() {
    this.mensaje = '';

    const passwordGuardada = localStorage.getItem('passwordBryale') || '123456';

    if (!this.passwordActual || !this.passwordNueva || !this.passwordConfirmar) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    if (this.passwordActual !== passwordGuardada) {
      this.mensaje = 'La contraseña actual es incorrecta.';
      return;
    }

    if (this.passwordNueva.length < 6) {
      this.mensaje = 'La nueva contraseña debe tener mínimo 6 caracteres.';
      return;
    }

    if (this.passwordNueva !== this.passwordConfirmar) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    localStorage.setItem('passwordBryale', this.passwordNueva);

    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmar = '';

    this.mensaje = 'Contraseña actualizada correctamente.';
  }
}
