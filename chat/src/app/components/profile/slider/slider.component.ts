import { Component } from "@angular/core";
import { IonicSlides } from "@ionic/angular";

@Component({
  selector: "app-profile-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.scss"]
})
export class SliderComponent {
  swiperModules= [IonicSlides];
  presentationData = ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"];
  constructor () {

  }

  onSlideChange(event: any){

  }
}
