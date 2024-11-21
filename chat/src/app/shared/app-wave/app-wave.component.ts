import { Component, OnInit } from "@angular/core";
@Component({
  selector: 'app-wave',
  templateUrl: './app-wave.component.html',
  styleUrls: ['./app-wave.component.scss']
})
export class AppWaveComponent implements OnInit {
  userImageUrl: string = "https://images.unsplash.com/photo-1440589473619-3cde28941638?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlfGVufDB8fDB8fHww"

  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   console.log('Hello');

  }
}
