import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {UserDetails } from '../Models/user-details';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerModel = new UserDetails(new Object());

  constructor(private Auth: AuthService, private router: Router) 
  {
  }
  ngOnInit() { // ctor #oninit
  }

  RegisterUser(){
     this.Auth.Register(this.registerModel, (callback) => 
     {
          
     });   
  }

}
