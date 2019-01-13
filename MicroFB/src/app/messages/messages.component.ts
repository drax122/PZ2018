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

  sendMessage(msg:string){
    var m = new Message({});
    m.AuthorId = parseInt(localStorage.getItem("UserId"));
    m.Content = msg;
    m.ConversationId =this.getConvId;
    this.messgesService.sendMessage(m).subscribe(messageId =>{
      m.Id = parseInt(JSON.stringify(messageId));
      this.SocketService.SendMsg(m);
      this.Messages.push(m);
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
