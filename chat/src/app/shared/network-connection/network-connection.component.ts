import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-network-connection',
    templateUrl: './network-connection.component.html',
    styleUrls: ['./network-connection.component.scss'],
    standalone: false
})

export class NetworkConnectionComponent implements OnInit {
  constructor(){}

  ngOnInit(): void {
    console.log('Hello from networkConnection');

  }
}
