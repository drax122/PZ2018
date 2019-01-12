import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Notifications} from '../Models/notifications'

@Injectable({
  providedIn: 'root'
})
export class NotificationsServiceService {

  constructor(private http : HttpClient) { }

  getUserNotifications(Id) : Observable<Array<Notifications>>{
    return this.http.get("/api/notifications/getusernotifications/"+Id).map((entr:Notifications[]) => entr.map(e=> new Notifications(e)));
  }

  sendNotification(not:Notifications) : Observable<Notifications>{
    return this.http.post('/api/notifications/add', not).map((res:any) => new Notifications(res));
  }

}
