import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  menuOutline,
  notificationsOutline,
  cubeOutline,
  cartOutline,
  addCircleOutline,
  barChartOutline,
  folderOutline,
  personCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule]
})
export class PanelPage {

  menuAbierto = false;
  notificacionesAbiertas = false;

  totalProductos = 0;
  totalCategorias = 0;
  ventasHoy = 0;

  productos: any[] = [];
  ventas: any[] = [];
  alertasStock: any[] = [];

  LIMITE_STOCK_BAJO = 20;

  constructor(private router: Router) {
    addIcons({
      menuOutline,
      notificationsOutline,
      cubeOutline,
      cartOutline,
      addCircleOutline,
      barChartOutline,
      folderOutline,
      personCircleOutline
    });
  }

  ionViewWillEnter() {
    this.cargarResumen();
  }

  cargarResumen() {
    const datosProductos = localStorage.getItem('productosBryale');
    const datosVentas = localStorage.getItem('ventasBryale');

    this.productos = datosProductos ? JSON.parse(datosProductos) : [];
    this.ventas = datosVentas ? JSON.parse(datosVentas) : [];

    this.totalProductos = this.productos.length;

    this.alertasStock = this.productos.filter((p: any) =>
      Number(p.cantidad) <= this.LIMITE_STOCK_BAJO
    );

    const categorias = this.productos
      .map((p: any) => p.categoria)
      .filter((c: any) => c && c.trim() !== '');

    this.totalCategorias = new Set(categorias).size;

    const hoy = this.formatearFechaISO(new Date());

    this.ventasHoy = this.ventas.filter((v: any) => {
      if (!v.fecha) return false;
      return this.formatearFechaISO(new Date(v.fecha)) === hoy;
    }).length;
  }

  formatearFechaISO(fecha: Date) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  abrirMenu() {
    this.menuAbierto = true;
    this.notificacionesAbiertas = false;
  }

  verNotificaciones() {
    this.notificacionesAbiertas = true;
    this.menuAbierto = false;
  }

  cerrarVentanas() {
    this.menuAbierto = false;
    this.notificacionesAbiertas = false;
  }

  cerrarSesion() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  irInventario() {
    this.router.navigateByUrl('/inventario');
  }

  irVenta() {
    this.router.navigateByUrl('/venta');
  }

  irProducto() {
    this.router.navigateByUrl('/producto');
  }

  irReportes() {
    this.router.navigateByUrl('/reportes');
  }

  irCategorias() {
    this.router.navigateByUrl('/categorias');
  }

  irPerfil() {
    this.router.navigateByUrl('/perfil');
  }
}