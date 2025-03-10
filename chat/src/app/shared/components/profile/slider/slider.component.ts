import { AfterViewInit, Component, ElementRef, Input, OnChanges, Signal, SimpleChanges, ViewChild } from "@angular/core";
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

  currentIndex: number = 0
  currentImage: string | null = null;

  constructor (
    private discoverService: DiscoverService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.currentIndex = 0;
    console.log(this.currentIndex)
    this.viewerProfileIsActive =  this.profileToView?.disableSwipe ?? false;
  }

  ngAfterViewInit(): void {
    this.swiper = this.swiperContainer.nativeElement.swiper;
  }

  setUserImages (profile: Member) {
 return [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww',
'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVvcGxlfGVufDB8fDB8fHww'
    ]
  /*   return  Array(2).fill(StringUtils.getAvatarUrl(profile.avatar)); */
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


  setProfileDetailsStyle(profileToView: DisableProfileSwipe | null): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)  return "profile-summary profile-summary__show";
    if (!profileToView?.disableSwipe) {
        return  "profile-summary profile-summary__show"
    }  else {
        return  "profile-summary profile-summary__hide"
    }
  }

 setSwiperContainerHeight(profileToView: DisableProfileSwipe | null ): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)  return "swiper-container swiper-container__preview-disabled-height";
    if (!profileToView?.disableSwipe) {
        return  "swiper-container swiper-container__preview-disabled-height"
    }  else {
        return  "swiper-container swiper-container__preview-enabled-height"
    }
  }

  setProfileImagesHeight(profileToView: DisableProfileSwipe | null) {
  if (this.profile?.user_id !== profileToView?.profile.user_id)  return "profile-img  profile-img__preview-disabled";
    if (!profileToView?.disableSwipe) {
        return  "profile-img  profile-img__preview-disabled"
    }  else {
        return  "profile-img  profile-img__preview-enabled"
    }
}

  onProfilePreview() {
  console.log("From preview")
    if (this.profileToView?.disableSwipe) return;
    this.discoverService.onDiscoverProfileToggle({profile: this.profile,  disableSwipe: true})
  }

  slideLeft() {
    console.log("From left")
    this.slidePrev()
  }

  private slidePrev() {
  if (this.currentIndex > 0) {
    this.currentIndex = this.currentIndex - 1;
    console.log(this.currentIndex)

  } else {
   // this.currentIndex = this.setUserImages(this.profile).length - 1; // Loop back to last image
    console.log(this.currentIndex)
  }
}

private slideNext() {
  if (this.currentIndex <  this.setUserImages(this.profile).length - 1) {
    this.currentIndex = this.currentIndex + 1;
    console.log(this.currentIndex)

  } else {
    //this.currentIndex = 0; // Loop back to last image
    console.log(this.currentIndex)
  }
}
  slideRight() {
    console.log("From right")
    this.slideNext()
  }

}
