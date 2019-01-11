import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component'
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = 
[
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate : [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [   
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService, AuthGuard],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
