import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  imageOutline,
  cloudUploadOutline,
  readerOutline,
  scanOutline,
  cashOutline,
  documentAttachOutline,
  gridOutline,
  createOutline,
  saveOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonSelect,
    IonSelectOption
  ]
})
export class ProductoPage {

  imagenProducto: string | ArrayBuffer | null = null;

  nombreProducto = '';
  codigoProducto = '';
  precio: number | null = null;
  cantidad: number | null = null;
  categoria = '';
  descripcion = '';
  mensajeError = '';

  LIMITE_STOCK_BAJO = 20;

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      imageOutline,
      cloudUploadOutline,
      readerOutline,
      scanOutline,
      cashOutline,
      documentAttachOutline,
      gridOutline,
      createOutline,
      saveOutline
    });
  }

  volverPanel() {
    this.router.navigateByUrl('/panel');
  }

  seleccionarImagen(event: any) {
    const archivo = event.target.files[0];

    if (archivo) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagenProducto = reader.result;
      };

      reader.readAsDataURL(archivo);
    }
  }

  eliminarImagen() {
    this.imagenProducto = null;
  }

  guardarProducto() {
    this.mensajeError = '';

    if (
      !this.nombreProducto ||
      !this.codigoProducto ||
      this.precio === null ||
      this.cantidad === null ||
      !this.categoria
    ) {
      this.mensajeError = 'Completa todos los campos obligatorios.';
      return;
    }

    const datos = localStorage.getItem('productosBryale');
    const productos = datos ? JSON.parse(datos) : [];

    const codigoExiste = productos.some((p: any) =>
      String(p.codigo).toLowerCase().trim() ===
      String(this.codigoProducto).toLowerCase().trim()
    );

    if (codigoExiste) {
      this.mensajeError = 'Ya existe un producto con ese código.';
      return;
    }

    const producto = {
      imagen: this.imagenProducto,
      nombre: this.nombreProducto,
      codigo: this.codigoProducto,
      precio: Number(this.precio),
      cantidad: Number(this.cantidad),
      categoria: this.categoria,
      descripcion: this.descripcion,
      estado: Number(this.cantidad) <= this.LIMITE_STOCK_BAJO
        ? 'Reponer stock'
        : 'Disponible'
    };

    productos.push(producto);

    localStorage.setItem('productosBryale', JSON.stringify(productos));

    alert('Producto guardado correctamente');

    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.imagenProducto = null;
    this.nombreProducto = '';
    this.codigoProducto = '';
    this.precio = null;
    this.cantidad = null;
    this.categoria = '';
    this.descripcion = '';
    this.mensajeError = '';
  }
}