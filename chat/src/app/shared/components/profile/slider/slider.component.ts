import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { IonicSlides } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Swiper } from "swiper/types";
import { DisableProfileSwipe, DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
type PageName = "discover" | "profile-viewer" ;

@Component({
    selector: "app-profile-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    standalone: false
})
export class SliderComponent implements OnChanges, AfterViewInit {
  @Input() profile: any;
  @Input() profileToView: DisableProfileSwipe | null = null;
  @Input() swipeDirection: any;
  @Input() pageName:  PageName | null = null;
  @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;
  @ViewChild('swiperContainer', {static: false} ) swiperContainer!: ElementRef;

  swiperModules= [IonicSlides];
  userImages: string [] = [] ;
  //profileViewer: boolean = false;

  viewerProfileIsActive: boolean = false ;

  sliderHeight: string = ""
  swiper!: Swiper; // Store Swiper instance

  swiperOptions = {
    pagination: { clickable: true },
    allowTouchMove: false,  // Disable Swiper's internal swipe handling
  };

  constructor (
    private discoverService: DiscoverService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.viewerProfileIsActive =  this. profileToView ? this.profileToView?.disableSwipe : false;
    this.setUserImages();
    console.log( this.viewerProfileIsActive, "hello", this.profile)
  }


  ngAfterViewInit(): void {
    this.swiper = this.swiperContainer.nativeElement.swiper;
  }

  setProfileSummaryStyle() {

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

  onProfileClick(event: MouseEvent, profile: any) {
    console.log(profile, "hello")
    const clientX = event.clientX;
    const clientY = event.clientY;

    const cardWidth = this.swiperContainer.nativeElement.offsetWidth;
    const cardHeight = this.swiperContainer.nativeElement.offsetHeight;

    if (cardWidth === null || cardWidth === undefined || cardHeight === undefined || cardHeight === null) return;

    const cardCenter = cardWidth / 2;
    const lastQuarterY = cardHeight * 0.75; // last quarter (3/4 of the height)

     // Check if click is in the last quarter of the card
  if (clientY > lastQuarterY) {
    console.log()
    this.onProfilePreview(); // Trigger profile preview
    return; // Exit to avoid sliding action
  }
   ( clientX < cardCenter) ? this.slideLeft(): this.slideRight() ;
  }

  private onProfilePreview() {
    if (this.profileToView?.disableSwipe) return;
    this.discoverService.onDiscoverProfileToggle({profile: this.profile,  disableSwipe: true})
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



  onViewProfile() {
    console.log('Hello profile to view')
  }

}
