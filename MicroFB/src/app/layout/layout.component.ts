
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent  {

  constructor(private Auth: AuthService, private router: Router) { }

  ngOnInit() {
  }
  get LoggedIn(){
    return this.Auth.IsLogged;
  }

}
