import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IonicSlides } from "@ionic/angular";
import { Subscription } from "rxjs";
import { TapService } from "src/app/tabs/services/tap/tap.service";
import { Swiper } from "swiper/types";

@Component({
    selector: "app-profile-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    standalone: false
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() profile: any;
  @Input() swipeDirection: any;
  @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;
  @ViewChild('swiperContainer', {static: false} ) swiperContainer!: ElementRef;

  swiperModules= [IonicSlides];
  userImages: string [] = []
  defaultImage = 'assets/images/default-profile.jpg';

  private tapEventSource!: Subscription ;

  swiper!: Swiper; // Store Swiper instance

  swiperOptions = {
    pagination: { clickable: true },
    allowTouchMove: false,  // Disable Swiper's internal swipe handling
  };

  constructor (private tapService: TapService) {}

  ngOnInit(): void {
    //this.subscribeToTapEvent();
    console.log(this.profile, "Hello profile")
    this.setUserImages();
  }
  ngAfterViewInit(): void {
    this.swiper = this.swiperContainer.nativeElement.swiper;
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


  onProfileClick(event: MouseEvent) {
    console.log("Hello form clikc")
    const clientX = event.clientX;
    const cardWidth = this.swiperContainer.nativeElement.offsetWidth;

    if (cardWidth === null || cardWidth === undefined) return;

    const cardCenter = cardWidth / 2;

   ( clientX < cardCenter) ? this.slideLeft(): this.slideRight() ;
  }

  private slideLeft() {
    if (this.swiper) this.swiper.slidePrev();
  }

  private slideRight() {
    if (this.swiper) this.swiper.slideNext()
  }


  private setUserImages (): void {
      if (!this.profile) return;

      if (this.profile.images?.length) {
        this.userImages = this.profile.images;
      } else  {
        this.userImages.push(this.profile.avatar);
        this.userImages.push(this.profile.avatar);
      }
  }

  ngOnDestroy(): void {
    if (this.tapEventSource) {
      this.tapEventSource.unsubscribe()
    }
  }

}
