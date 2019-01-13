
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SocketService } from '../DataServices/socket.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent  {

  constructor(private Auth: AuthService, private router: Router,
    private SocketService : SocketService) { }

  logout()
  {
    this.SocketService.Logout(parseInt(localStorage.getItem("UserId")));
    this.Auth.logOut();
    this.router.navigate(['/home']);
  }
  ngOnInit() {
  }
  get LoggedIn(){
    return this.Auth.IsLogged;
  }

}
