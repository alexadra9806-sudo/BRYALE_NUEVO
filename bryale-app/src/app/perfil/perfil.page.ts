import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  personOutline,
  lockClosedOutline,
  informationCircleOutline,
  logOutOutline,
  chevronForwardOutline,
  cameraOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PerfilPage {

  fotoPerfil: string | ArrayBuffer | null = null;

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      personOutline,
      lockClosedOutline,
      informationCircleOutline,
      logOutOutline,
      chevronForwardOutline,
      cameraOutline
    });
  }

  seleccionarFoto(event: any) {
    const archivo = event.target.files[0];

    if (archivo) {
      const lector = new FileReader();

      lector.onload = () => {
        this.fotoPerfil = lector.result;
      };

      lector.readAsDataURL(archivo);
    }
  }

  regresar() {
    this.router.navigate(['/panel']);
  }

  irInformacionPersonal() {
    this.router.navigate(['/perfil/informacion-personal']);
  }

  irCambiarPassword() {
    this.router.navigate(['/perfil/cambiar-password']);
  }

  irAcercaDe() {
    this.router.navigate(['/perfil/acerca-de']);
  }

  cerrarSesion() {

    localStorage.removeItem('usuarioBryale');

    this.router.navigate(['/login'], {
      replaceUrl: true
    });

  }
}