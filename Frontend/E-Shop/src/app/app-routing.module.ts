import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuardService } from './auth-guard/admin-auth-guard.service';
import { UserAuthGuardService } from './auth-guard/user-auth-guard.service';
import { AdminCustomersComponent } from './components/admin/admin-customers/admin-customers.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminNewProductComponent } from './components/admin/admin-new-product/admin-new-product.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

const routes: Routes = [
  { path: '', canActivate: [UserAuthGuardService], component: HomeComponent },
  { path: 'home', canActivate: [UserAuthGuardService], component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', canActivate: [UserAuthGuardService], component: CartComponent },
  { path: 'user-orders', canActivate: [UserAuthGuardService], component: UserOrdersComponent },
  { path: 'orders', canActivate: [UserAuthGuardService], component: UserOrdersComponent },
  {
    path: 'admin' , component: AdminHomeComponent, canActivate: [AdminAuthGuardService, UserAuthGuardService],
    children : [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: AdminDashboardComponent},
      { path: 'orders', component: AdminOrdersComponent},
      { path: 'products', component: AdminProductsComponent},
      { path: 'new-product', component: AdminNewProductComponent},
      { path: 'customers', component: AdminCustomersComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
