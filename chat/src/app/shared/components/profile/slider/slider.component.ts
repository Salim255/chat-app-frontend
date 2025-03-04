import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IonicSlides } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Swiper } from "swiper/types";
import { DiscoverService } from "src/app/features/discover-profiles/services/discover.service";

type PageName = "discover" | "profile-viewer" ;

@Component({
    selector: "app-profile-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    standalone: false
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() profile: any;
  @Input() swipeDirection: any;
  @Input() pageName:  PageName | null = null;
  @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;
  @ViewChild('swiperContainer', {static: false} ) swiperContainer!: ElementRef;

  swiperModules= [IonicSlides];
  userImages: string [] = []

  private tapEventSource!: Subscription ;

  swiper!: Swiper; // Store Swiper instance

  swiperOptions = {
    pagination: { clickable: true },
    allowTouchMove: false,  // Disable Swiper's internal swipe handling
  };

  constructor (private discoverService: DiscoverService) {}

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

    const clickedElement = event.target as HTMLElement;
    console.log( clickedElement, clickedElement.children)


    const clientX = event.clientX;
    const clientY = event.clientY;

    console.log(clientY , "hello ")
    const cardWidth = this.swiperContainer.nativeElement.offsetWidth;
    const cardHeight = this.swiperContainer.nativeElement.offsetHeight;

    if (cardWidth === null || cardWidth === undefined || cardHeight === undefined || cardHeight === null) return;

    const cardCenter = cardWidth / 2;
    const lastQuarterY = cardHeight * 0.75; // last quarter (3/4 of the height)

     // Check if click is in the last quarter of the card
  if (clientY > lastQuarterY) {
    this.onProfilePreview(); // Trigger profile preview
    return; // Exit to avoid sliding action
  }
   ( clientX < cardCenter) ? this.slideLeft(): this.slideRight() ;
  }

  private onProfilePreview() {
    this.discoverService.onDiscoverProfileToggle('expand')
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

  setSliderHeight(pageName: PageName | null  ) {
    if (!pageName) return ;
    return  pageName === 'discover' ? "72vh" : "72vh"

  }

  ngOnDestroy(): void {
    if (this.tapEventSource) {
      this.tapEventSource.unsubscribe()
    }
  }

  onViewProfile() {
    console.log('Hello profile to view')
  }

}
