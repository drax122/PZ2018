import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { UserDetails } from './Models/user-details';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { SocketService } from './DataServices/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get IsLogged()
  {
    return JSON.parse(localStorage.getItem("loggedIn")) || false;
  }

  constructor(private http: HttpClient, private router : Router, private SocketService: SocketService) { }

  RefreshToken()
  {
    let refresh_token = localStorage.getItem("refreshtoken");
    const body = new HttpParams()
    .set('refresh_token', refresh_token)
    .set('grant_type', "refresh_token")
    .set('client_id', "Angular")
    .set('client_secret', "smile")

    return this.http.post('/api/authenticate',
    body.toString(),
    {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  setLoggedIn(value: boolean)
  {
    localStorage.setItem('loggedIn', value.toString());
  }
  isLoggedIn():Observable<boolean>
  {
    if(JSON.parse(localStorage.getItem('loggedIn')))
    {
      // CHECK IF TOKEN IS VALID AND NOT EXPRIRED - IF EXPIRED REFRESH TOKEN - IF CANT REDIRECT TO LOGIN
      let now = new Date();
      let tokenExpriesIn = localStorage.getItem("expiresIn");
      let tokenExpireDate = new Date(Date.parse(localStorage.getItem("expiresAt")));
      console.log(now);
      console.log(tokenExpireDate);
      if(now >= tokenExpireDate)
      {
        // TOKEN JEST NIEWAZNY SPROBOJ ODSWIEZYC
        return this.RefreshToken().map(
          (res: Response) =>
          {
            let obj = JSON.parse(JSON.stringify(res));
            localStorage.setItem('UserId', (JSON.parse(obj.User)).Id);
            localStorage.setItem('token', obj.access_token);
            localStorage.setItem('refreshtoken', obj.refresh_token);
            localStorage.setItem('expiresAt', obj[".expires"]);
            localStorage.setItem('expiresIn', obj["expires_in"]);
            this.setLoggedIn(true);
            return true;
          }
        ).catch(this.errorHanlder)
      }
      else
      {
        this.setLoggedIn(true);
        return of(true);
      }
    }
    else
    {
      this.setLoggedIn(false);
      return of(false);
    }
  }
  errorHanlder(error : HttpErrorResponse)
  {
    this.setLoggedIn(false);
    return of(false);
  }
  logOut()
  {
    localStorage.clear();
    this.setLoggedIn(false);
  }

  Register(user : UserDetails, callback)
  {
    this.http.post('/api/users/RegisterUser',
    JSON.stringify(user),
    {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    ).subscribe(data =>
      {
        let obj = JSON.parse(JSON.stringify(data));
        console.log(obj);
        callback(obj.UserDisplayName);
      },
      error =>
      {
        callback(error.error);
      }
    )
  }

  loginUser(email, password, callback)
  {
    const body = new HttpParams()
    .set('username', email)
    .set('password', password)
    .set('grant_type', "password")
    .set('client_id', "Angular")
    .set('client_secret', "smile")

    this.http.post('/api/authenticate',
    body.toString(),
    {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe(data =>
      {
        let obj = JSON.parse(JSON.stringify(data));
        this.setLoggedIn(true);
        localStorage.setItem('UserId', (JSON.parse(obj.User)).Id);
        localStorage.setItem('token', obj.access_token);
        localStorage.setItem('refreshtoken', obj.refresh_token);
        localStorage.setItem('expiresAt', obj[".expires"]);
        localStorage.setItem('expiresIn', obj["expires_in"]);
        callback(obj.UserDisplayName);
        this.SocketService.Imonline(parseInt(localStorage.getItem("UserId")));
      },
      error =>
      {
        callback(error.error);
      }
    )
  }
}
