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
  Messages: Array<Message> = [];
  messagerModel = new Message(new Object());
  
  constructor(private messgesService : MessagesServiceService,  private route : ActivatedRoute, private SocketService : SocketService)
  {

  }

  sendMessage(e){
    e.AuthorId = parseInt(localStorage.getItem("UserId"));
    e.ConversationId = this.getConvId;
    this.messgesService.sendMessage(e).subscribe((message:Message) =>{
      this.SocketService.SendMsg(message);
      this.Messages.push(message);
    });
  }

  get getConvId(){
    return parseInt(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit() {
    this.messgesService.getMessages(this.getConvId).subscribe(data=>{
      this.Messages = data;
    });
    this.SocketService.Messages.subscribe(data=>{
      var newMessage = new Message(data);
      if(newMessage.ConversationId === this.getConvId){
          this.Messages.push(newMessage);
      }
    });
  }
}
