import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../Models/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  constructor(private http: HttpClient) {
    
  }
  sendMessage(msg : Message){
    return this.http.post("/api/messages/addmessage", JSON.stringify(msg));
  }
  getMessages(ConversationId : number): Observable<Message[]>{
    return this.http.get("/api/messages/getmessages/"+ConversationId).map((messages:any[]) => messages.map(m => new Message(m)));
  }
}
