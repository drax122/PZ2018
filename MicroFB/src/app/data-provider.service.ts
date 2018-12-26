import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor(private http: HttpClient) 
  {

  }
  getUserData(Id){
    return this.http.get("/api/Users/"+Id);
  }



}
