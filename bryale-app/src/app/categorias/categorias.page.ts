import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';

interface Categoria {
  nombre: string;
  productos: number;
}

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CategoriasPage {

  categoriasBase: string[] = [
    'Cuadernos',
    'Escritura',
    'Papelería',
    'Arte y manualidades',
    'Oficina'
  ];

  categorias: Categoria[] = [];
  productos: any[] = [];
  productosCategoria: any[] = [];

  categoriaSeleccionada: string = '';
  productoSeleccionado: any = null;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    const datosProductos = localStorage.getItem('productosBryale');
    this.productos = datosProductos ? JSON.parse(datosProductos) : [];

    const datosCategorias = localStorage.getItem('categoriasBryale');
    const categoriasExtra = datosCategorias ? JSON.parse(datosCategorias) : [];

    const todasCategorias = [
      ...this.categoriasBase,
      ...categoriasExtra
    ];

    this.categorias = todasCategorias.map((nombre: string) => {
      const cantidad = this.productos.filter((p: any) =>
        this.normalizarTexto(p.categoria) === this.normalizarTexto(nombre)
      ).length;

      return {
        nombre,
        productos: cantidad
      };
    });

    if (this.categoriaSeleccionada) {
      this.abrirCategoria(this.categoriaSeleccionada);
    }
  }

  abrirCategoria(nombre: string) {
    this.categoriaSeleccionada = nombre;

    this.productosCategoria = this.productos.filter((p: any) =>
      this.normalizarTexto(p.categoria) === this.normalizarTexto(nombre)
    );
  }

  verProducto(producto: any) {
    this.productoSeleccionado = producto;
  }

  cerrarProducto() {
    this.productoSeleccionado = null;
  }

  async nuevaCategoria() {
    const alerta = await this.alertController.create({
      header: 'Nueva Categoría',
      message: 'Escribe el nombre de la nueva categoría.',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Ejemplo: Mochilas'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const nombre = data.nombre?.trim();

            if (!nombre) {
              return false;
            }

            const datos = localStorage.getItem('categoriasBryale');
            const categoriasExtra = datos ? JSON.parse(datos) : [];

            const existe = [
              ...this.categoriasBase,
              ...categoriasExtra
            ].some((cat: string) =>
              this.normalizarTexto(cat) === this.normalizarTexto(nombre)
            );

            if (existe) {
              window.alert('Esa categoría ya existe.');
              return false;
            }

            categoriasExtra.push(nombre);

            localStorage.setItem(
              'categoriasBryale',
              JSON.stringify(categoriasExtra)
            );

            this.cargarCategorias();
            return true;
          }
        }
      ]
    });

    await alerta.present();
  }

  volver() {
    if (this.productoSeleccionado) {
      this.productoSeleccionado = null;
      return;
    }

    if (this.categoriaSeleccionada) {
      this.categoriaSeleccionada = '';
      this.productosCategoria = [];
    } else {
      this.navCtrl.navigateBack('/panel');
    }
  }

  normalizarTexto(texto: string) {
    return (texto || '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}