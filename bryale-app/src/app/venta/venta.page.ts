import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class VentaPage {

  metodoPago = 'efectivo';
  montoRecibido = 0;
  descuento = 0;
  buscar = '';

  productos: any[] = [];
  carrito: any[] = [];
  ventas: any[] = [];

  mostrarRegistro = false;

  constructor(private navCtrl: NavController) {}

  ionViewWillEnter() {
    this.cargarProductos();
    this.cargarVentas();
  }

  cargarProductos() {
    const datos = localStorage.getItem('productosBryale');
    this.productos = datos ? JSON.parse(datos) : [];
  }

  cargarVentas() {
    const datos = localStorage.getItem('ventasBryale');
    this.ventas = datos ? JSON.parse(datos) : [];
  }

  volverPanel() {
    if (this.mostrarRegistro) {
      this.mostrarRegistro = false;
    } else {
      this.navCtrl.navigateBack('/panel');
    }
  }

  abrirRegistro() {
    this.cargarVentas();
    this.mostrarRegistro = true;
  }

  irReportes() {
    this.navCtrl.navigateForward('/reportes');
  }

  get productosDisponibles() {
    const texto = this.buscar.toLowerCase().trim();

    if (!texto) return [];

    return this.productos.filter((p: any) =>
      Number(p.cantidad) > 0 &&
      (
        (p.nombre || '').toLowerCase().includes(texto) ||
        (p.codigo || '').toLowerCase().includes(texto) ||
        (p.categoria || '').toLowerCase().includes(texto)
      )
    );
  }

  agregarProducto(producto: any) {
    const existe = this.carrito.find((p: any) => p.codigo === producto.codigo);

    if (existe) {
      if (existe.cantidadVenta < Number(producto.cantidad)) {
        existe.cantidadVenta++;
      } else {
        alert('No hay más stock disponible.');
      }
    } else {
      this.carrito.push({ ...producto, cantidadVenta: 1 });
    }

    this.buscar = '';
  }

  aumentarCantidad(producto: any) {
    if (producto.cantidadVenta < Number(producto.cantidad)) {
      producto.cantidadVenta++;
    } else {
      alert('No hay más stock disponible.');
    }
  }

  disminuirCantidad(producto: any) {
    if (producto.cantidadVenta > 1) {
      producto.cantidadVenta--;
    }
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
  }

  get subtotal(): number {
    return this.carrito.reduce(
      (total, p) => total + Number(p.precio) * Number(p.cantidadVenta),
      0
    );
  }

  get total(): number {
    const totalFinal = this.subtotal - Number(this.descuento || 0);
    return totalFinal < 0 ? 0 : totalFinal;
  }

  get vuelto(): number {
    return Number(this.montoRecibido || 0) - this.total;
  }

  confirmarVenta() {
    if (this.carrito.length === 0) {
      alert('Agrega productos a la venta.');
      return;
    }

    if (this.metodoPago === 'efectivo' && Number(this.montoRecibido) < this.total) {
      alert('El monto recibido no alcanza.');
      return;
    }

    this.carrito.forEach((item: any) => {
      const productoOriginal = this.productos.find((p: any) => p.codigo === item.codigo);

      if (productoOriginal) {
        productoOriginal.cantidad =
          Number(productoOriginal.cantidad) - Number(item.cantidadVenta);
      }
    });

    localStorage.setItem('productosBryale', JSON.stringify(this.productos));

    const ahora = new Date();

    const venta = {
      id: Date.now(),
      fecha: ahora.toISOString(),
      fechaMostrar: ahora.toLocaleDateString(),
      horaMostrar: ahora.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      metodoPago: this.metodoPago === 'efectivo' ? 'Efectivo' : 'Yape',
      productos: this.carrito.map((p: any) => ({
        nombre: p.nombre,
        codigo: p.codigo,
        categoria: p.categoria,
        imagen: p.imagen,
        precio: Number(p.precio),
        cantidadVenta: Number(p.cantidadVenta),
        totalProducto: Number(p.precio) * Number(p.cantidadVenta)
      })),
      subtotal: this.subtotal,
      descuento: Number(this.descuento || 0),
      total: this.total
    };

    const datosVentas = localStorage.getItem('ventasBryale');
    const ventas = datosVentas ? JSON.parse(datosVentas) : [];

    ventas.push(venta);
    localStorage.setItem('ventasBryale', JSON.stringify(ventas));

    alert('Venta guardada correctamente.');

    this.carrito = [];
    this.buscar = '';
    this.montoRecibido = 0;
    this.descuento = 0;
    this.metodoPago = 'efectivo';

    this.cargarProductos();
    this.cargarVentas();

    this.mostrarRegistro = true;
  }
}