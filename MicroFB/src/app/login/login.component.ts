import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {User} from '../Models/user';
import { AppRoutingModule } from '../app-routing.module';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userModel = new User('','');
  ErrorMessage = '';
  constructor(private Auth: AuthService, private router: Router) 
  {
  }

  ngOnInit() {
  }

  logIn(){    
    this.Auth.loginUser(this.userModel.username,this.userModel.password, (message) =>{
      // callback 
      if(message.error !== undefined)
      {
        this.ErrorMessage = message.error_description;
      }
      else
      {
        this.router.navigate(["/home"]);
      }
    });
  }
}
