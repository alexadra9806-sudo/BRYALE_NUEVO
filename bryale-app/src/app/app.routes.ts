import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('./panel/panel.page').then(m => m.PanelPage),
  },
  {
    path: 'inventario',
    loadComponent: () =>
      import('./inventario/inventario.page').then(m => m.InventarioPage),
  },
  {
    path: 'venta',
    loadComponent: () =>
      import('./venta/venta.page').then(m => m.VentaPage),
  },
  {
    path: 'producto',
    loadComponent: () =>
      import('./producto/producto.page').then(m => m.ProductoPage),
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./reportes/reportes.page').then(m => m.ReportesPage),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./categorias/categorias.page').then(m => m.CategoriasPage),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./perfil/perfil.page').then(m => m.PerfilPage),
  },
  {
    path: 'perfil/informacion-personal',
    loadComponent: () =>
      import('./perfil/informacion-personal/informacion-personal.page')
        .then(m => m.InformacionPersonalPage),
  },
  {
    path: 'perfil/cambiar-password',
    loadComponent: () =>
      import('./perfil/cambiar-password/cambiar-password.page')
        .then(m => m.CambiarPasswordPage),
  },
  {
    path: 'perfil/acerca-de',
    loadComponent: () =>
      import('./perfil/acerca-de/acerca-de.page')
        .then(m => m.AcercaDePage),
  },
];