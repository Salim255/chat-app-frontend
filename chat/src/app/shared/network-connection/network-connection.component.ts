import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-network-connection',
  templateUrl: './network-connection.component.html',
  styleUrls: ['./network-connection.component.scss']
})

export class NetworkConnectionComponent implements OnInit {
  constructor(){}

  ngOnInit(): void {
    console.log('Hello from networkConnection');

  }
}
