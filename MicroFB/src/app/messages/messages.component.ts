import { Component, OnInit } from '@angular/core';
import { MessagesServiceService } from '../DataServices/messages-service.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../Models/message';
import { WebsocketService } from '../websocket.service';
import { SocketService } from '../DataServices/socket.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  ConversationId : number;
  Messages: Array<Message> = [];

  constructor(private messgesService : MessagesServiceService,  private route : ActivatedRoute, private SocketService : SocketService) 
  {
    this.ConversationId = parseInt(this.route.snapshot.paramMap.get('id'));
    messgesService.getMessages(this.ConversationId).subscribe(data=>{
      this.Messages = data;
    });
  }

  sendMessage(msg:string){
    var m = new Message({});
    m.AuthorId = parseInt(localStorage.getItem("UserId"));
    m.Content = msg;
    m.ConversationId = this.ConversationId;
    this.messgesService.sendMessage(m).subscribe(messageId =>{
      m.Id = parseInt(JSON.stringify(messageId));
      this.SocketService.SendMsg(m);
      this.Messages.push(m);
    });
  }
  ngOnInit() {
    this.SocketService.Messages.subscribe(data=>{ 
      var newMessage = new Message(data);
      if(newMessage.ConversationId === this.ConversationId){
          this.Messages.push(newMessage);
      }
    });
  }
}
