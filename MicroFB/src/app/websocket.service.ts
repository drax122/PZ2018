import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import {Observable} from 'rxjs/Observable'
import * as Rx from 'rxjs/Rx';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;
  private UserId = {};
  constructor()
   {
      this.socket = io(environment.ws_url);
   }

  connect(): Rx.Subject<MessageEvent>{
      let observable = new Observable(observer => {
          this.socket.on('UserLoggedIn', (data) =>{
          observer.next(data);
        })
      });
      let observer = {
        next: (data: Object) => {
          this.socket.emit('IMIN', JSON.stringify(data));
        },
      };
      return Rx.Subject.create(observer, observable);
  }
  disconnect(): Rx.Subject<MessageEvent>{
    let observable = new Observable(observer => {
        this.socket.on('UserLoggedOut', (data) =>{
        observer.next(data);
      })
    });
    let observer = {
      next: (data: Object) => {
        console.log(data);
        this.socket.emit('IMOUT', JSON.stringify(data));
      },
    };
    return Rx.Subject.create(observer, observable);
  } 

  status(): Rx.Subject<MessageEvent>{
    let observable = new Observable(observer => {
        this.socket.on('UsersOnline', (data) =>{
        observer.next(data);
      })
    });
    let observer = {
      next: (data: Object) => {
        
      },
    };
    return Rx.Subject.create(observer, observable);
  }

  Messages(): Rx.Subject<MessageEvent>{
    let observable = new Observable(observer => {
        this.socket.on('message', (data) =>{
        observer.next(data);
      })
    });
    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };
    return Rx.Subject.create(observer, observable);
}

Invitations(): Rx.Subject<MessageEvent>{
  let observable = new Observable(observer => {
      this.socket.on('AcceptedInvitaiton', (data) =>{
      observer.next(data);
    })
  });
  let observer = {
    next: (data: Object) => {
      this.socket.emit('AcceptInv', JSON.stringify(data));
    },
  };
  return Rx.Subject.create(observer, observable);
}

  
}
