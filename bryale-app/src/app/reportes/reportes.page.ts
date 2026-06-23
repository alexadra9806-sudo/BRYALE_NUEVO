import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ReportesPage {

  fechaSeleccionada = this.obtenerFechaHoy();

  productos: any[] = [];
  ventas: any[] = [];
  ventasFiltradas: any[] = [];

  ventasDia = 0;
  productosVendidosDia = 0;

  disponibles = 0;
  stockBajo = 0;
  agotados = 0;

  topProductos: any[] = [];
  productosReponer: any[] = [];

  LIMITE_STOCK_BAJO = 20;

  constructor(private navCtrl: NavController) {
    addIcons({ calendarOutline });
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.productos = JSON.parse(localStorage.getItem('productosBryale') || '[]');
    this.ventas = JSON.parse(localStorage.getItem('ventasBryale') || '[]');

    this.calcularReportes();
  }

  calcularReportes() {
    this.calcularVentasPorFecha();
    this.calcularInventario();
    this.calcularTopProductos();
    this.calcularProductosReponer();
  }

  calcularVentasPorFecha() {
    this.ventasFiltradas = this.ventas.filter((venta: any) => {
      if (!venta.fecha) return false;

      const fechaVenta = this.formatearFechaISO(new Date(venta.fecha));
      return fechaVenta === this.fechaSeleccionada;
    });

    this.ventasDia = this.ventasFiltradas.reduce(
      (total: number, venta: any) => total + Number(venta.total || 0),
      0
    );

    this.productosVendidosDia = this.ventasFiltradas.reduce(
      (total: number, venta: any) => {
        const cantidadVenta = (venta.productos || []).reduce(
          (suma: number, p: any) => suma + Number(p.cantidadVenta || 0),
          0
        );

        return total + cantidadVenta;
      },
      0
    );
  }

  calcularInventario() {
    this.disponibles = this.productos.filter((p: any) =>
      Number(p.cantidad) > this.LIMITE_STOCK_BAJO
    ).length;

    this.stockBajo = this.productos.filter((p: any) =>
      Number(p.cantidad) > 0 &&
      Number(p.cantidad) <= this.LIMITE_STOCK_BAJO
    ).length;

    this.agotados = this.productos.filter((p: any) =>
      Number(p.cantidad) === 0
    ).length;
  }

  calcularTopProductos() {
    const mapa: any = {};

    this.ventasFiltradas.forEach((venta: any) => {
      (venta.productos || []).forEach((p: any) => {
        const codigo = p.codigo || p.nombre;

        if (!mapa[codigo]) {
          mapa[codigo] = {
            codigo,
            nombre: p.nombre,
            imagen: p.imagen,
            ventas: 0,
            totalGanado: 0
          };
        }

        mapa[codigo].ventas += Number(p.cantidadVenta || 0);
        mapa[codigo].totalGanado += Number(p.totalProducto || 0);
      });
    });

    this.topProductos = Object.values(mapa)
      .sort((a: any, b: any) => b.ventas - a.ventas)
      .slice(0, 10);
  }

  calcularProductosReponer() {
    this.productosReponer = this.productos.filter((p: any) =>
      Number(p.cantidad) <= this.LIMITE_STOCK_BAJO
    );
  }

  cambiarFecha(event: any) {
    this.fechaSeleccionada = event.target.value;
    this.calcularReportes();
  }

  volverPanel() {
    this.navCtrl.navigateBack('/panel');
  }

  obtenerFechaHoy() {
    return this.formatearFechaISO(new Date());
  }

  formatearFechaISO(fecha: Date) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}