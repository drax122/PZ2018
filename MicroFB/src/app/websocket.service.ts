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
          console.log("User logged in data:" + data);
          observer.next(data);
        })
      });
      let observer = {
        next: (data: Object) => {
          this.socket.emit('IMIN', data);
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
        this.socket.emit('IMOUT', data);
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
        this.socket.emit('SendMessage', JSON.stringify(data));
      },
    };
    return Rx.Subject.create(observer, observable);
}

Invitations(): Rx.Subject<MessageEvent>{
  let observable = new Observable(observer => {
      this.socket.on('AcceptedInvitation', (data) =>{
      observer.next(data);
    })
  });
  let observer = {
    next: (data: Object) => {
      this.socket.emit('AcceptInv', data);
    },
  };
  return Rx.Subject.create(observer, observable);
}

SendInvitation(): Rx.Subject<MessageEvent>{
  let observable = new Observable(observer => {
      this.socket.on('InvitationSent', (data) =>{
      observer.next(data);
    })
  });
  let observer = {
    next: (data: Object) => {
      this.socket.emit('SendInvitation', data);
    },
  };
  return Rx.Subject.create(observer, observable);
}

Notifications(): Rx.Subject<MessageEvent>{
  let observable = new Observable(observer => {
      this.socket.on('Notification', (data) =>{
      observer.next(data);
    })
  });
  let observer = {
    next: (data: Object) => {
      this.socket.emit('SendNotification', data);
    },
  };
  return Rx.Subject.create(observer, observable);
}

Likes(): Rx.Subject<MessageEvent>{
  let observable = new Observable(observer => {
      this.socket.on('Like', (data) =>{
      observer.next(data);
    })
  });
  let observer = {
    next: (data: Object) => {
      this.socket.emit('Like', data);
    },
  };
  return Rx.Subject.create(observer, observable);
}

Posts(): Rx.Subject<MessageEvent>{
  let observable = new Observable(observer => {
      this.socket.on('NewPost', (data) =>{
      observer.next(data);
    })
  });
  let observer = {
    next: (data: Object) => {
      this.socket.emit('SendPost', JSON.stringify(data));
    },
  };
  return Rx.Subject.create(observer, observable);
}
  
}
