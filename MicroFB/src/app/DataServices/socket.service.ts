import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  connect : Subject<any>; // Logujemy się - powiadamiamy innych, i dostajemy listę zalogowanych
  status : Subject<any>; // ktoś się zalogował - przychodzi nam jego ID i możemy się wylogować za pomocą next here
  Messages : Subject<any>; // chcemy wysłać wiadomość/otrzymujemy nową wiadomość

  constructor(private ws: WebsocketService) {
    this.connect = <Subject<any>>ws.connect().map((response:any): any =>{
      return response;
    });
    this.status = <Subject<any>>ws.status().map((response:any): any =>{
      return response;
    });
    this.Messages = <Subject<any>>ws.Messages().map((response:any): any =>{
      return response;
    });
  }
  Imonline(UserId){
    this.connect.next(UserId);
  }
  Logout(UserId){
    this.status.next(UserId);
  }
  SendMsg(msg){
    this.Messages.next(msg);
  }
  
  
}
