import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { IonicSlides } from "@ionic/angular";
import Swiper from "swiper";


@Component({
  selector: "app-profile-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.scss"]
})
export class SliderComponent implements OnInit, OnChanges {
  @Input() profile: any;
  @Input() swipeDirection: any;
  @ViewChild('swiperContainer', {static: false} ) swiperContainer: any;

  swiperModules= [IonicSlides];
  presentationData:any ;
  constructor () {

  }

  ngOnInit(): void {
    if (this.profile) {
      this.presentationData = this.profile.images
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.swipeDirection) {
     this.onSwipe(this.swipeDirection)
    }
  }


  onSwipe(swipeDirection: string) {
     if (swipeDirection === 'right') {
      this.swiperContainer.
        nativeElement.swiper.slideNext();
     } else if (swipeDirection === 'left') {
      this.swiperContainer.
      nativeElement.swiper.slidePrev();
     }
  }

  onSlideChange(event: any){

  }

}
