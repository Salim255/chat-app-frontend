import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IonicSlides } from "@ionic/angular";
import { Subscription } from "rxjs";
import { TapService } from "src/app/services/tap/tap.service";

@Component({
    selector: "app-profile-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    standalone: false
})
export class SliderComponent implements OnInit, OnDestroy{
  @Input() profile: any;
  @Input() swipeDirection: any;
  @ViewChild('swiperContainer', {static: false} ) swiperContainer: any;

  swiperModules= [IonicSlides];
  presentationData: string[] = [];

  defaultImage = 'assets/images/default-profile.jpg';

  private tapEventSource!: Subscription ;

  constructor (private tapService: TapService) {

  }

  ngOnInit(): void {

    if (this.profile) {
      if (this.profile?.images?.length > 0) {
        this.presentationData = this.profile.images
      }
      else  if (this.profile?.avatar?.length > 0) {
        const accountAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.profile?.avatar}`;
        this.presentationData = [ accountAvatar ];

      } else  {
        this.presentationData.push(this.defaultImage)
      }
    }

    this.tapEventSource = this.tapService.getTapEventType.subscribe(data => {
      if (data?.tapSide && data?.clientId === this.profile?.id) {
        this.onSwipe(data.tapSide)
      }
    })
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

  ngOnDestroy(): void {
    if (this.tapEventSource) {
      this.tapEventSource.unsubscribe()
    }
  }

}
