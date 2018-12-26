import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private Auth: AuthService, private router: Router) 
  {
  }
  get LoggedIn(){
    return this.Auth.IsLogged;
  }



}
