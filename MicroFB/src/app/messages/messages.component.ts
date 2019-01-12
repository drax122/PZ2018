import { Component, OnInit } from '@angular/core';
import { MessagesServiceService } from '../DataServices/messages-service.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private messgesService : MessagesServiceService) { }

  ngOnInit() {
    
  }
}
