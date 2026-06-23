import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  personOutline,
  mailOutline,
  callOutline,
  briefcaseOutline,
  locationOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.page.html',
  styleUrls: ['./informacion-personal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class InformacionPersonalPage {

  editando: boolean = false;

  usuario = {
    nombre: 'Administrador BRYALE',
    correo: 'adminbryale@gmail.com',
    telefono: '987 654 321',
    cargo: 'Administrador',
    direccion: 'Los Olivos, Lima'
  };

  constructor(private router: Router) {

    addIcons({
      arrowBackOutline,
      personOutline,
      mailOutline,
      callOutline,
      briefcaseOutline,
      locationOutline
    });

    // Cargar datos guardados
    const datosGuardados = localStorage.getItem('usuarioPerfil');

    if (datosGuardados) {
      this.usuario = JSON.parse(datosGuardados);
    }
  }

  regresar() {
    this.router.navigate(['/perfil']);
  }

  editarInformacion() {

    if (this.editando) {

      localStorage.setItem(
        'usuarioPerfil',
        JSON.stringify(this.usuario)
      );

      console.log('Información guardada:', this.usuario);
    }

    this.editando = !this.editando;
  }

}