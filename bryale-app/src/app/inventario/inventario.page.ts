import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class InventarioPage {

  filtro: string = 'todo';
  buscar: string = '';

  productos: any[] = [];

  productoSeleccionado: any = null;
  cantidadReponer: number | null = null;

  LIMITE_STOCK_BAJO = 20;

  constructor(private navCtrl: NavController) {}

  ionViewWillEnter() {
    this.cargarProductos();
  }

  cargarProductos() {
    const datos = localStorage.getItem('productosBryale');
    this.productos = datos ? JSON.parse(datos) : [];
  }

  volverPanel() {
    this.navCtrl.navigateBack('/panel');
  }

  cambiarFiltro(valor: string) {
    this.filtro = valor;
  }

  obtenerEstado(producto: any): string {
    const cantidad = Number(producto.cantidad);

    if (cantidad === 0) {
      return 'agotado';
    }

    if (cantidad <= this.LIMITE_STOCK_BAJO) {
      return 'bajo';
    }

    return 'disponible';
  }

  obtenerTextoEstado(producto: any): string {
    const estado = this.obtenerEstado(producto);

    if (estado === 'agotado') {
      return 'Agotado';
    }

    if (estado === 'bajo') {
      return 'Bajo stock';
    }

    return 'Disponible';
  }

  abrirReponer(producto: any) {
    this.productoSeleccionado = producto;
    this.cantidadReponer = null;
  }

  cerrarReponer() {
    this.productoSeleccionado = null;
    this.cantidadReponer = null;
  }

  guardarReposicion() {
    if (!this.productoSeleccionado) return;

    if (!this.cantidadReponer || this.cantidadReponer <= 0) {
      alert('Ingresa una cantidad válida.');
      return;
    }

    const producto = this.productos.find((p: any) =>
      p.codigo === this.productoSeleccionado.codigo
    );

    if (producto) {
      producto.cantidad = Number(producto.cantidad) + Number(this.cantidadReponer);

      producto.estado =
        Number(producto.cantidad) <= this.LIMITE_STOCK_BAJO
          ? 'Reponer stock'
          : 'Disponible';

      localStorage.setItem('productosBryale', JSON.stringify(this.productos));

      alert('Stock actualizado correctamente.');
    }

    this.cerrarReponer();
    this.cargarProductos();
  }

  get productosFiltrados() {
    return this.productos.filter((p: any) => {
      const estado = this.obtenerEstado(p);

      const coincideFiltro =
        this.filtro === 'todo' || estado === this.filtro;

      const textoBuscar = this.buscar.toLowerCase().trim();

      const coincideBusqueda =
        !textoBuscar ||
        (p.nombre || '').toLowerCase().includes(textoBuscar) ||
        (p.codigo || '').toLowerCase().includes(textoBuscar) ||
        (p.categoria || '').toLowerCase().includes(textoBuscar);

      return coincideFiltro && coincideBusqueda;
    });
  }
}