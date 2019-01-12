import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsServiceService {

  constructor(private http : HttpClient) { }

  getUserNotifications(Id){
    return this.http.get("/api/notifications/getusernotifications/"+Id);
  }

  sendNotification(not:Notification){
    
  }

}
