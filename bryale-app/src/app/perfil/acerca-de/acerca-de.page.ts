import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  libraryOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.page.html',
  styleUrls: ['./acerca-de.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AcercaDePage {

  constructor(private router: Router) {

    addIcons({
      arrowBackOutline,
      libraryOutline
    });

  }

  regresar() {
    this.router.navigate(['/perfil']);
  }

}