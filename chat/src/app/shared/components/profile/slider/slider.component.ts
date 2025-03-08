import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { IonicSlides } from "@ionic/angular";
import { Swiper } from "swiper/types";
import { DisableProfileSwipe, DiscoverService } from "src/app/features/discover-profiles/services/discover.service";
import { StringUtils } from "src/app/shared/utils/string-utils";
import { Member } from "src/app/shared/interfaces/member.interface";

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
  swiper!: Swiper; // Store Swiper instance
  swiperOptions = {
    pagination: { clickable: true },
    allowTouchMove: false,  // Disable Swiper's internal swipe handling
  };

  viewerProfileIsActive: boolean = false ;
  sliderHeight: string = ""

  constructor (
    private discoverService: DiscoverService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.viewerProfileIsActive =  this.profileToView?.disableSwipe ?? false;
  }

  ngAfterViewInit(): void {
    this.swiper = this.swiperContainer.nativeElement.swiper;
  }

  setUserImages (profile: Member) {
    return  Array(2).fill(StringUtils.getAvatarUrl(profile.avatar));
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

  onProfileClick( profile: any) {
    //console.log( "hello from slide click😍😍😍")
   // const clientX = event.clientX;
    //const clientY = event.clientY;

    const cardWidth = this.swiperContainer.nativeElement.offsetWidth;
    //const cardHeight = this.swiperContainer.nativeElement.offsetHeight;

    //console.log(!cardWidth  || !cardHeight, "hello")
    //if (!cardWidth  || !cardHeight ) return;

    //const cardCenter = cardWidth / 2;
    //const lastQuarterY = cardHeight * 0.75; // last quarter (3/4 of the height)

     // Check if click is in the last quarter of the card
/*   if (clientY > lastQuarterY) {

    this.onProfilePreview(); // Trigger profile preview
    return; // Exit to avoid sliding action
  } */
  //( clientX < cardCenter) ? this.slideLeft(): this.slideRight() ;
  }

  setProfileDetailsStyle(profileToView: DisableProfileSwipe | null): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)  return "profile-summary profile-summary__show";
    if (!profileToView?.disableSwipe) {
        return  "profile-summary profile-summary__show"
    }  else {
        return  "profile-summary profile-summary__hide"
    }
  }

  setSwiperContainerHeight(profileToView: DisableProfileSwipe  | null): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)  return "swiper-container swiper-container__preview-disabled-height";
    if (!profileToView?.disableSwipe) {
        return  "swiper-container swiper-container__preview-disabled-height"
    }  else {
        return  "swiper-container swiper-container__preview-enabled-height"
    }

  }
 onProfilePreview() {
  console.log(this.profileToView?.disableSwipe, "1")
    if (this.profileToView?.disableSwipe) return;
    console.log(this.profileToView?.disableSwipe, "2")
    this.discoverService.onDiscoverProfileToggle({profile: this.profile,  disableSwipe: true})
  }

  slideLeft() {
    if (this.swiper) this.swiper.slidePrev();
  }


  slideRight() {
    if (this.swiper) this.swiper.slideNext()
  }

}
