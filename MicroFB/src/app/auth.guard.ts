import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';
import { s } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService){
  }
  canActivate() : Observable<boolean>
  {
    return this.auth.isLoggedIn();
  }
}
