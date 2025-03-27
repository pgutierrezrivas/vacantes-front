import { Routes } from "@angular/router";
import { Page404Component } from "./pages/page404/page404.component";
import { RegisterComponent } from "./pages/public/register/register.component";
import { LoginComponent } from "./pages/public/login/login.component";
import { HomeComponent } from "./pages/public/home/home.component";
import { DashboardEmpresaComponent } from "./pages/empresa/dashboard-empresa/dashboard-empresa.component";
import { ListaVacantesComponent } from "./pages/usuario/lista-vacantes/lista-vacantes.component";
import { CrearVacanteComponent } from "./pages/empresa/crear-vacante/crear-vacante.component";
import { EditarVacanteComponent } from "./pages/empresa/editar-vacante/editar-vacante.component";
import { PerfilEmpresaComponent } from "./pages/empresa/perfil-empresa/perfil-empresa.component";
import { ListaSolicitudesComponent } from "./pages/empresa/lista-solicitudes/lista-solicitudes.component";
import { DashboardAdminComponent } from "./pages/admin/dashboard-admin/dashboard-admin.component";
import { ListaEmpresasComponent } from "./pages/admin/lista-empresas/lista-empresas.component";
import { CrearEmpresaComponent } from "./pages/admin/crear-empresa/crear-empresa.component";
import { EditarEmpresaComponent } from "./pages/admin/editar-empresa/editar-empresa.component";
import { ListaCategoriasComponent } from "./pages/admin/lista-categorias/lista-categorias.component";
import { ListaUsuariosComponent } from "./pages/admin/lista-usuarios/lista-usuarios.component";
import { ListaAdministradoresComponent } from "./pages/admin/lista-administradores/lista-administradores.component";
import { DashboardUsuarioComponent } from "./pages/usuario/dashboard-usuario/dashboard-usuario.component";
import { DetalleVacanteComponent } from "./pages/usuario/detalle-vacante/detalle-vacante.component";
import { PostularVacanteComponent } from "./pages/usuario/postular-vacante/postular-vacante.component";
import { MisSolicitudesComponent } from "./pages/usuario/mis-solicitudes/mis-solicitudes.component";
import { MisVacantesComponent } from "./pages/empresa/mis-vacantes/mis-vacantes.component";
import { roleGuard } from './security/guards/role.guard';
import { authGuard } from "./security/guards/auth.guard";


export const routes: Routes = [

    // rutas publicas (leas añadimos el authGuard para que si un usuario ya esta logado no acceda de nuevo a ellas)
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  
    // rutas de Empresa (protegidas)
    { path: 'empresa/dashboard', component: DashboardEmpresaComponent, canActivate: [roleGuard], data: { expectedRole: 'EMPRESA' } },
    { path: 'empresa/vacantes', component: MisVacantesComponent, canActivate: [roleGuard], data: { expectedRole: 'EMPRESA' } },
    { path: 'empresa/vacante/nueva', component: CrearVacanteComponent, canActivate: [roleGuard], data: { expectedRole: 'EMPRESA' } },
    { path: 'empresa/vacante/editar/:id', component: EditarVacanteComponent, canActivate: [roleGuard], data: { expectedRole: 'EMPRESA' } },
    { path: 'empresa/vacante/solicitudes/:id', component: ListaSolicitudesComponent, canActivate: [roleGuard], data: { expectedRole: 'EMPRESA' } },
    { path: 'empresa/perfil', component: PerfilEmpresaComponent, canActivate: [roleGuard], data: { expectedRole: 'EMPRESA' } },
  
    // rutas de Administrador (protegidas)
    { path: 'admin/dashboard', component: DashboardAdminComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
    { path: 'admin/empresas', component: ListaEmpresasComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
    { path: 'admin/empresa/nueva', component: CrearEmpresaComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
    { path: 'admin/empresa/editar/:id', component: EditarEmpresaComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
    { path: 'admin/categorias', component: ListaCategoriasComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
    { path: 'admin/usuarios', component: ListaUsuariosComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
    { path: 'admin/admins', component: ListaAdministradoresComponent, canActivate: [roleGuard], data: { expectedRole: 'ADMON' } },
  
    // rutas de Usuario (protegidas)
    { path: 'usuario/dashboard', component: DashboardUsuarioComponent, canActivate: [roleGuard], data: { expectedRole: 'CLIENTE' } },
    { path: 'usuario/vacantes', component: ListaVacantesComponent, canActivate: [roleGuard], data: { expectedRole: 'CLIENTE' } },
    { path: 'usuario/vacante/:id', component: DetalleVacanteComponent, canActivate: [roleGuard], data: { expectedRole: 'CLIENTE' } },
    { path: 'usuario/vacante/:id/postular', component: PostularVacanteComponent, canActivate: [roleGuard], data: { expectedRole: 'CLIENTE' } },
    { path: 'usuario/solicitudes/:id', component: MisSolicitudesComponent, canActivate: [roleGuard], data: { expectedRole: 'CLIENTE' } },
  
    // rutas por defecto
    { path: '**', component: Page404Component },
    { path: '', pathMatch:'full', redirectTo: 'home'}
  ];
  